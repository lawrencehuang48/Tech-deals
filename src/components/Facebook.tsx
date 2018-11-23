import * as React from "react";
import FacebookLogin from 'react-facebook-login'

 class Facebook extends React.Component {
    public state = {
        email: '',
        isLoggedIn: false,
        name: '',
        picture: '',
        userID:'',
    }

    public responseFacebook = (response: any) => {
        // tslint:disable-next-line:no-console
        console.log();
    }

    // tslint:disable-next-line:no-console
    public componentClicked = () => console.log("clicked")

    public render () {
        let fbContent;

        if(this.state.isLoggedIn) {
            fbContent = null;
        } else {
            fbContent = (  <FacebookLogin
                appId="295346271312168"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />)
        }

        return (
            <div>
                {fbContent}
            </div>
        )
    }
}

export default Facebook;