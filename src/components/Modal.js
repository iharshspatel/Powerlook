import React, { Component } from 'react';

export default class Modal extends Component {

    componentDidMount(){
        const {show, id, onHide} = this.props;

        if(typeof show !== 'undefined' && show === true){
            window.$$('#' + id).modal('show');

            // Remove modal from dom as it hides
            if(typeof onHide !== 'undefined'){
                window.$$('#' + id).on('hidden.bs.modal', (e) => {
                    this.props.onHide();
                });
            }   
        }
    }

    render() {
        const {header, footer, bodyClass, footerClass, body, id, dialogClass} = this.props;

        return (
            <div className="modal fade modal-style" id={id}>
                <div className={`modal-dialog modal-460 ${typeof dialogClass !== 'undefined' ? dialogClass : ''}`}>
                    <div className="modal-content">
                        <button type="button" className="close pos-btn-close" data-dismiss="modal">&times;</button>
                        {
                            typeof header !== 'undefined'
                            &&
                            <div className="modal-head-block">
                                {header}
                            </div>
                        }
                        <div className={`modal-body-block ${typeof bodyClass !== 'undefined' ? bodyClass : ''}`}>
                            {body}
                        </div>
                        {
                            typeof footer !== 'undefined'
                            &&
                            <div className={`modal-footer-block ${typeof footerClass !== 'undefined' ? footerClass : ''}`}>
                                {footer}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}