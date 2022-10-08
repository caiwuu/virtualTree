export default function(fn, delay) {
    let lock = false;
    return (...args) => {
        if (lock)
            return;
        //进入加锁
        lock = true;
        setTimeout(() => {
            fn.apply(this, args);
            //执行完毕解锁
            lock = false;
        }, delay);
    }
}