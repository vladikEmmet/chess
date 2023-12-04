export const parseTime = (time: number) => {
    const minutes = Math.trunc(time / 60);
    const seconds = time - (minutes * 60);
    let result: string[] = [];
    
    if(minutes < 10) {
        result.push(`0${minutes}`);
    } else {
        result.push(minutes.toString());
    }

    if(seconds < 10) {
        result.push(`0${seconds}`);
    } else {
        result.push(seconds.toString());
    }

    return result.join(":");
}