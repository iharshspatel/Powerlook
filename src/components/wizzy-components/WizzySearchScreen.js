import React from "react";
import Header from "../Header";
import Footer from "../Footer";

class WizzySearchScreen extends React.Component {
    componentDidMount() {
		var interval = setInterval(() => {
			if(typeof window.wizzySearchInit === "function") {
				window.wizzySearchInit();
				clearInterval(interval);
			}
		}, 200);
	}
    render() {
        return(
            <>
                <Header />
                    <div className="wizzy-main-content main-wrapper" style={{ padding: 25 }}>
                    
                    </div>
                <Footer />
            </>
        )
    }
}

export default WizzySearchScreen;