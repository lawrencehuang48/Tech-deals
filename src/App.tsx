import * as React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { FaListUl, FaRedo } from 'react-icons/fa';
import Modal from 'react-responsive-modal';
import './App.css';
import Facebook from './components/Facebook';
import ProductInfo from './components/ProductInfo';
import ProductList from './components/ProductList';
import logo from './logo.jpg';



interface IState {
  currentDeal: any,
  dealsList: any[],
  show: boolean;
  uploadFileList: any,
  isLoaded: boolean,
  audio: any,
}

class App extends React.Component <{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      audio: null,
      currentDeal: {"id":0, "title":"","url":"","tags":"","PublsihDate":"","UpvoteCount":"", "Links":"","Width":"","Height":""},
      dealsList: [],
      isLoaded: false,
      show: false,
      uploadFileList: null,
    }

    this.getProducts("")
		this.selectNewDeal = this.selectNewDeal.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.getProducts = this.getProducts.bind(this)
    this.uploadProductPhoto = this.uploadProductPhoto.bind(this)
  }

    public getProducts(tag: any) {
    let url = "https://techsalesapi.azurewebsites.net/api/sales"
    if (tag !== "") {
			url += "/tags?=" + tag
		}
    fetch(url, {
      method: 'GET'
    })
    .then(results => results.json())
      .then(json => {
        let currentDeal = json[0]
        if (currentDeal === undefined) {
          currentDeal = {"id":0, "title":"","url":"","tags":"","PublsihDate":"","UpvoteCount":"", "Links":"","Width":"","Height":""}
        }
        this.setState({
          currentDeal,
          dealsList: json,
          isLoaded: true,
        })
      });
  }


  public render() {
    const { show, isLoaded } = this.state
    if (!isLoaded) {
      return <div style={{ alignItems: 'center', color: '#bfbfbf', display: 'flex', fontSize: '35px',   
      height: '100vh',  justifyContent: 'center',  textAlign: 'center', }}>Loading... <br /><FaRedo className="LoadingIcon"/></div>
    }

    else {
      return (
        <div className="App">
          <header className="App-header" style={{borderBottom: '1px solid #bfbfbf'}}>
            <div>
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className="App-title" style={{color: '#808080', marginLeft: '5px'}}>TECH DEALS NZ</h1>
              <div style={{top:'0', right:'0', position: 'absolute', paddingTop: '15px', paddingRight: '10px'}}>
                <Button style={{borderStyle: 'none'}}>Login</Button>
                <Button bsStyle="primary">Signup</Button>
              </div>
              <div style={{top:'0', left:'0', position: 'absolute', paddingTop: '15px', paddingLeft: '10px', color: 'black', fontSize: '2.5em', cursor: 'pointer'}}><FaListUl/></div>
            </div>
          </header>            
          <p className="App-intro" style={{fontStyle: 'oblique', color: '#808080'}}>
            "Community driven page dedicated to sharing daily tech deals in NZ" 
          </p>
          <div>
            <Facebook/>
          </div>
          <div>
						  <ProductList dealsList={this.state.dealsList} selectNewDeal={this.selectNewDeal} searchByTag={this.getProducts} audio={this.state.audio}/>
					    <ButtonToolbar className="CenterButtons" style={{display: 'flex'}}>
                <button className="AddButton" onClick={this.OpenModal}><img src={logo} style={{height: '18px', marginRight:'4px'}}/>ADD A DEAL</button>
              </ButtonToolbar>
          </div>

            <ProductInfo currentDeal={this.state.currentDeal} />

            <Modal open={show} onClose={this.CloseModal}>
                <form className="formDisplay">
                  <div className="form-group">
                    <label>Title</label>
                    <small> (Include price, discounted %, and vendor name)</small>
                    <input type="text" className="form-control" placeholder="e.g. Sony headphones $499 20% off at PBtech" id="product-title"/>
                  </div>
                  <div className="form-group">
                    <label>Tag</label>
                    <small> (ssd, headphones etc.)</small>
                    <input type="text" className="form-control" placeholder="Enter tag name(s)" id="product-tag"/>
                  </div>
                  <div className="form-group">
                      <label id="product-link">Post your link here and add a caption (optional)</label>
                      <textarea style={{display: 'block', width: "370px", height: "150px"}}/>
                  </div>
                  <div className="form-group">
                    <label>Image of product</label>
                    <small> (Image is required per submission rules)</small>
                    <input type="file" onChange={this.handleFileUpload} className="form-control=file"/>
                  </div>
                  <button type="submit" className="btn SubmitButton" style={{backgroundColor: '#337ab7', color: 'white'}} onClick={this.uploadProductPhoto}>Add Deal</button>
                </form>
            </Modal>
        </div>
      );
    }        
  }


	private OpenModal = () => {
		this.setState({ show: true });
	  };
	
	private CloseModal = () => {
		this.setState({ show: false });
  };

  private selectNewDeal(newDeal: any) {
		this.setState({
			currentDeal: newDeal
		})
  }
  
  private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
  }
  
  private uploadProductPhoto() {
		const uploadTitle = document.getElementById("product-title") as HTMLInputElement
    const uploadTag = document.getElementById("product-tag") as HTMLInputElement
    const uploadLink = document.getElementById("product-link") as HTMLTextAreaElement
		const imageFile = this.state.uploadFileList[0]

    /// Check for empty fields
		if (uploadTitle === null || uploadTag === null || uploadLink === null || imageFile === null) {
			return;
    }


		const title = uploadTitle.value
    const tag = uploadTag.value
    const link = uploadLink.value
		const url = "https://techsalesapi.azurewebsites.net/api/sales/upload"

		const formData = new FormData()
		formData.append("Title", title)
    formData.append("Tags", tag)
    formData.append("links", link)
		formData.append("image", imageFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				alert(response.statusText)
			} else {
				location.reload()
			}
		  })
	}
  
}

export default App;
