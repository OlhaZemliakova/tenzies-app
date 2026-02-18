type DieProps = {
    value: number;
    hold: () => void;
    isHeld: boolean;
};

export default function Die({value, hold, isHeld} : DieProps) {
    const style = isHeld ? "holdDie" : undefined;

    return (
        <button className={`die ${isHeld && "held"}`} onClick={hold}>{value}</button>
    )
}