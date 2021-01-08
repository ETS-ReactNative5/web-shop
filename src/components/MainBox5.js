import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';  
class MainBox5 extends React.Component {
    constructor(){
        super(); 
		this.state = {visible: false};
        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);
    

	}
	onClick(event) {
        this.setState({visible: true});
    }

    onHide(event) {
        this.setState({visible: false});
    }
    render(){
		const footer = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={this.onHide} />
                <Button label="No" icon="pi pi-times" onClick={this.onHide} className="p-button-secondary" />
            </div>
        );

        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>Dialog</h1>
                        <p>Dialog is a container to display content in an overlay window.</p>
                    </div>
                </div>

                <div className="content-section implementation">
                    <Dialog header="Godfather I" visible={this.state.visible} width="350px" footer={footer} minY={70} onHide={this.onHide} maximizable={true}>
                        The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding. 
                        His beloved son Michael has just come home from the war, but does not intend to become part of his father's business. 
                        Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family, 
                        kind and benevolent to those who give respect, but given to ruthless violence whenever anything stands against the good of the family.
                    </Dialog>

                    <Button label="Show" icon="pi pi-external-link" onClick={this.onClick} />
                </div>
            </div>
        )
    }
}
export default MainBox5;