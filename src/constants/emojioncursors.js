const cursors = {
    drag : String.fromCodePoint(129306), //EMOJI BACKHAND
    pointer : String.fromCodePoint(128070), //EMOJI FINGER POINTING
    editLine : String.fromCodePoint(9997) + String.fromCodePoint(65039), //EMOJI HOLDING PEN,
    pinch : String.fromCodePoint(129295),
    key : String.fromCodePoint(128273), // Maybe change to items?
    hold : String.fromCodePoint(9995) 
}
const skinColor = {
    noColor : "",
    dark : String.fromCodePoint(127999),
    mediumDark : String.fromCodePoint(127998),
    medium : String.fromCodePoint(127997),
    mediumLight : String.fromCodePoint(127996),
    light : String.fromCodePoint(127995),
}
export {cursors, skinColor};
