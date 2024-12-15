const parseFirstName = (name: string) => {
    const names = name.split(' ');
    return names[0];
};

export default parseFirstName;