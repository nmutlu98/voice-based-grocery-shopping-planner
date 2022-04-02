
let units = ["gram", "kilogram", "millilitre", "litre", "pound", "ounce"]
     
function IngredientRow(props){
    var name = props.name
    var amount = props.amount
    var unit = props.unit

    var style = {margin: 5}

    return(
        <div className="row">
            <input style={style} type="text" id="quantity" name="quantity" value={name}></input>
            <input style={style} type="number" id="quantity" name="quantity" value={amount}></input>
            <select>
                 {units.map(e => {
                     switch(unit){
                         case "kg":
                             unit = "kilogram"
                             break;
                         case "gr":
                             unit = "gram"
                             break;    
                         case "ml":
                             unit = "ml"
                             break;
                         case "L":
                             unit = "litre"
                             break;        
                     }
                     if(e === unit)
                        return <option selected value={e}>{e}</option>
                    else
                        return <option value={e}>{e}</option>
                 })}
            </select>
            
        </div>
    );

}

export default IngredientRow;