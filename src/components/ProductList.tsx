import * as React from "react";
import { FaMicrophone } from 'react-icons/fa'
import logo from './logo.jpg';

interface IProps {
    dealsList: any[],
    selectNewDeal: any,
    searchByTag: any,
    audio: null
}

export default class DealList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)
        this.searchByTag = this.searchByTag.bind(this)
        this.state = {
            audio: null
        }
    }

	public render() {
		return (
			<div className="container">
                <div className="row">
                    <div className="input-group SearchBar" style= {{paddingTop: '10px', paddingBottom: '20px'}}>
                        <input type="text" id="search-tag-textbox" className="form-control col-2" placeholder="⚲ Search product by category" style= {{padding:'20px 20px 20px 20px', borderRadius: '25px', backgroundColor: 'transparent'}} />
                        <div className="input-group-append" style={{backgroundColor: 'transparent', borderRadius: '25px'}}>
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>
                                <div><img src={logo} style={{height: '18px', marginRight:'4px'}}/>Search</div>
                            </div>
                        </div>
                        <div className="input-group-append mic-button" onClick = {this.TriggerMic}><FaMicrophone/></div>
                    </div>  
                </div>
                <div className="row product-list">
                    <table className="table">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Trigger Microphone Permission
    private async TriggerMic() {
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        this.setState({ audio })
    }

    // Create table displaying list of products
	private createTable() {
        const table:any[] = []
        const dealList = this.props.dealsList
        if (dealList == null) {
            return table
        }

        for (let i = 0; i < dealList.length; i++) {
            const children = []
            const deal = dealList[i]
            children.push(<td key={"name" + i}>{deal.title}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    private selectRow(index: any) {
        const selectedDeal = this.props.dealsList[index]
        if (selectedDeal != null) {
            this.props.selectNewDeal(selectedDeal)
        }
    }

    // Search product
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
            if (textBox === null) {
                return;
            }
            const tag = textBox.value 
            this.props.searchByTag(tag)  
          }

}