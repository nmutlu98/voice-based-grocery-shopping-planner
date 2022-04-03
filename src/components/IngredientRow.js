import { useState } from "react"

let units = ["gr", "kg", "ml", "L"]
     
function IngredientRow(props){
  
    const [name, setName] = useState(props.name)
    const [amount, setAmount] = useState(props.amount)
    const [unit, setUnit] = useState(props.unit)

    var style = {margin: 5}

    return(
        <div className="row">
            <input style={style} type="text" id="quantity" name="quantity" value={name} onChange={e => setName(e.target.value)}></input>
            <input style={style} type="number" id="quantity" name="quantity" value={amount} onChange={e => setAmount(e.target.value)}></input>
            <select value={unit} onChange={e => setUnit(e.target.value)}>
                 {units.map(e => {
                     return <option value={e}>{e}</option>
                    
                 })}
            </select>
            
        </div>
    );

}

export default IngredientRow;