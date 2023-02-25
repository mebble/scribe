(defn calculate-tax [brackets income]
  (as-> brackets x
    (take-while (fn [[lower _]] (>= income lower)) x)
    (vec x)
    (conj (pop x) [(- income (-> x last first)) (-> x last second)])
    (reduce (fn [sum [amount rate]] (+ sum (* amount (/ rate 100)))) 0 x)))

(comment
  (let [brackets [[0 0]
                  [250000 5]
                  [500000 10]
                  [1000000 30]]]
    (assert (= 0 (calculate-tax brackets 0)))
    (assert (= 0 (calculate-tax brackets 100)))
    (assert (= 0 (calculate-tax brackets 250000)))
    (assert (= 12500 (calculate-tax brackets 500000)))
    (assert (= 42500 (calculate-tax brackets 800000)))
    (assert (= 62500 (calculate-tax brackets 1000000)))
    (assert (= 362500 (calculate-tax brackets 2000000)))
    (assert (= 1262500 (calculate-tax brackets 5000000)))))
