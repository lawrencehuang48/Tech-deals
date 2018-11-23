import * as React from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { FaEdit, FaTrashAlt} from 'react-icons/fa';
import Modal from 'react-responsive-modal';

interface IProps {
    currentDeal: any
}

interface IState {
    show: boolean,
    opendelete: boolean
}

export default class ProductInfo extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            opendelete: false,
            show: false
        }

        this.updateDeal = this.updateDeal.bind(this)
    }

	public render() {
        const currentDeal = this.props.currentDeal
        const { show, opendelete } = this.state;
		return (
			<div className="container Shape product-wrapper" style={{borderRadius: "15px"}}>
                <div className="row">
                    <div className="product-head">({currentDeal.tags}) {currentDeal.publishDate}</div>       
                    <div className="IconPosition">
                        <a><FaEdit className="Icon pointer" onClick={this.OpenModal} /></a>
                        <a><FaTrashAlt className="Icon pointer" onClick={this.OpenModalDelete} style={{color: '#cc0000'}}/></a>               
                    </div>
                </div>
                <div className="row product-heading">
                    <b>{currentDeal.title}</b>&nbsp;
                </div>
                <div className="row product-links">
                    <a>{currentDeal.links}</a>
                </div>
                <div className="row product-img">
                    <img src={currentDeal.url} className="ImagePosition"/>
                </div>

                <Modal open={show} onClose={this.CloseModal}>
                    <form className="formDisplay">
                        <div className="form-group">
                            <label>Product Title</label>
                            <small> (Include price, discounted %, and vendor name)</small>
                            <input type="text" className="form-control" id="productTitle" placeholder="Enter Title"/>
                        </div>
                        <div className="form-group">
                            <label>Product Tag</label>
                            <small> (ssd, headphones etc.)</small>
                            <input type="text" className="form-control" id="productTag" placeholder="Enter Tag"/>
                        </div>
                        <div className="form-group">
                            <label>Edit your link here and caption (optional)</label>
                            <textarea id = "productLinks" style={{display: 'block', width: "370px", height: "150px"}}/>
                        </div>
                        <button type="button" className="btn" onClick={this.updateDeal} style={{backgroundColor: '#337ab7', color: 'white'}}>Save</button>
                    </form>
                </Modal>
                <Modal open={opendelete} onClose={this.CloseModalDelete}>
                    <div style={{padding: '25px'}}>
                        <p>Are you sure you want to delete this?</p>
                        <ButtonToolbar>
                            <Button bsStyle="danger" onClick={this.deleteProduct.bind(this, currentDeal.id)}>Yes</Button>
                            <Button onClick={this.CloseModalDelete}>No</Button>
                        </ButtonToolbar>
                    </div>
                </Modal>
                
            </div>
		);
    }

    // Modal Open
    private OpenModal = () => {
        this.setState({ show: true });
	  };
    
    // Modal Close
    private CloseModal = () => {
		this.setState({ show: false });
    };

    // Delete request Modal Open
    private OpenModalDelete = () => {
        this.setState({ opendelete: true });
        };
    
    // Delete Request Modal Close
    private CloseModalDelete = () => {
        this.setState({ opendelete: false });
    };
    


    // Delete product
    private deleteProduct(id: any) {
        const url = "https://techsalesapi.azurewebsites.net/api/sales/" + id

		fetch(url, {
			method: 'DELETE'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error Response
				alert(response.statusText)
			}
			else {
              location.reload()
			}
		  })
    }

    // Update product
    private updateDeal(){
        const titleInput = document.getElementById("productTitle") as HTMLInputElement
        const tagInput = document.getElementById("productTag") as HTMLInputElement
        const linksInput = document.getElementById("productLinks") as HTMLTextAreaElement

        // Check for empty fields
        if (titleInput === null || tagInput === null || linksInput === null) {
			return;
		}

        const currentDeal = this.props.currentDeal
        const url = "https://techsalesapi.azurewebsites.net/api/sales/" + currentDeal.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
        const updatedLink = linksInput.value
		fetch(url, {
			body: JSON.stringify({
                "height": currentDeal.height,
                "id": currentDeal.id,
                "links": updatedLink,
                "publishDate": currentDeal.publishDate,
                "tags": updatedTag,
                "title": updatedTitle,
                "url": currentDeal.url,
                "width": currentDeal.width
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				location.reload()
			}
		  })
    }
}