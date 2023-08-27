(require '[clojure.string :as s])

(defn- str->int [s]
  (Integer/parseInt s))

(defn- between? [[bottom top] n]
  (and (>= n bottom)
       (<= n top)))

(defn- digits? [s]
  (every? #(Character/isDigit %) s))

(defn- validate-parts [y m d]
  (and (every? (complement nil?) [y m d])
       (every? digits?           [y m d])
       (between? [1 12] (str->int m))
       (between? [1 31] (str->int d))))

(def months ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])

(defn- format-parts [y m d]
  (->> [y m d]
       (map str->int)
       (map (partial format "%02d"))
       (s/join "-")))

(defn- middle-endian-parts [s]
  (let [[m d y] (s/split s #"/")]
    (vector y m d)))

(defn- words-date-parts [s]
  (let [[m-and-d y-str] (s/split s #",")
        [m-word d]      (s/split m-and-d #" ")
        m               (str (inc (.indexOf months m-word)))
        y               (s/trim y-str)]
    (vector y m d)))

(defn parse-date [s]
  (when-let [parts (cond
                     (s/includes? s "/") (middle-endian-parts s)
                     (s/includes? s ",") (words-date-parts s)
                     :else nil)]
    (let [[y m d] parts]
      (when (validate-parts y m d)
        (format-parts y m d)))))

(assert (= "1636-09-08" (parse-date "9/8/1636")))
(assert (= "1636-09-08" (parse-date "September 8, 1636")))
(assert (= "1636-12-03" (parse-date "12/03/1636")))
(assert (= "1636-12-03" (parse-date "December 3, 1636")))

(assert (nil? (parse-date "8 September 1636")))
(assert (nil? (parse-date "8 September, 1636")))
(assert (nil? (parse-date "September, 1636")))
(assert (nil? (parse-date "Jan 1, 1970")))
(assert (nil? (parse-date "December 80, 1980")))
(assert (nil? (parse-date "23/6/1912")))

(loop []
  (print "Date: ")
  (flush)
  (let [s (read-line)
        date (parse-date s)]
    (if-not date
      (recur)
      (println date))))
