export default (mod: string) => {
    return console.log.bind(null, mod, ": ")
}
