import { useState } from "react"
import { Form, Row } from "react-bootstrap"

let units = ["gr", "kg", "ml", "L"]
     
function IngredientRow(props){
  
    const [name, setName] = useState(props.name)
    const [amount, setAmount] = useState(props.amount)
    const [unit, setUnit] = useState(props.unit)

    var style = {margin: 5, width: "30%"}

    return(
        <Row>
            
                <Form.Control style={style} type="text" id="quantity" name="quantity" value={name} onChange={e => setName(e.target.value)}/>
            
                <Form.Control style={style} type="number" id="quantity" name="quantity" value={amount} onChange={e => setAmount(e.target.value)}/>
            
                <Form.Select style={style} value={unit} onChange={e => setUnit(e.target.value)}>
                    {units.map(e => {
                        return <option value={e}>{e}</option>
                        
                    })}
                </Form.Select>
        
            
            
        </Row>
    );

}

export default IngredientRow;