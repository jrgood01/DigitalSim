import './ToolboxStyle.css'
import ToolboxItemComponent from "./ToolboxItemComponent";

function TooolBoxComponent() {
    return (
        <div className="ToolBox">
            <div className="ToolBoxHeader">
                <p>ToolBox</p>
            </div> 
            
            <ToolboxItemComponent label={"AND"} svg={'/svg/and.svg'}/>
            <ToolboxItemComponent label={"NAND"} svg={'/svg/nand.svg'}/>
            <ToolboxItemComponent label={"OR"} svg={'/svg/or.svg'}/>
            <ToolboxItemComponent label={"NOR"} svg={'/svg/nor.svg'}/>
            <ToolboxItemComponent label={"XOR"} svg={'/svg/xor.svg'}/>
            <ToolboxItemComponent label={"XNOR"} svg={'/svg/xnor.svg'}/>
            <ToolboxItemComponent label={"NOT"} svg={'/svg/not.svg'}/>
            <ToolboxItemComponent label={"LED"} svg={'/svg/led.svg'}/>
            <ToolboxItemComponent label={"CONST"} svg={'/svg/const.svg'}/>
        </div>
    )
}

export default TooolBoxComponent;