function diff(t1, t2) {
    const s1 = t1.s + t1.m * 60 + t1.h * 3600
    const s2 = t2.s + t2.m * 60 + t2.h * 3600
    const diffSecs = s2 - s1

    let remainingSecs = diffSecs
    const h = Math.floor(remainingSecs / 3600)
    remainingSecs = remainingSecs % 3600
    const m = Math.floor(remainingSecs / 60)
    remainingSecs = remainingSecs % 60
    const s = remainingSecs

    return { h, m, s }
}

function parseTimeString(timeString) {
    const [h, m, s] = timeString
        .split(':')
        .map(s => Number(s))
    return { h, m, s }
}

function createTimeString({ h, m, s }) {
    return (
        `${h}`.padStart(2, '0') + ':' +
        `${m}`.padStart(2, '0') + ':' +
        `${s}`.padStart(2, '0')
    )
}

const lessons = Array.from(document.querySelectorAll('a.lesson'))
    .map(a => {
        const title = a.querySelector('.title').textContent
        const timestamp = a.querySelector('.timestamp').textContent
        const [start, end] = timestamp.split(' - ')
        return { title, start, end, duration: createTimeString(diff(parseTimeString(start), parseTimeString(end))) }
    })

console.table(lessons)
