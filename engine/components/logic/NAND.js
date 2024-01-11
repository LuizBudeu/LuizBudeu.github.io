function NAND(...args) {
    return args.reduce((a, b) => !(a && b));
}

export default NAND;
