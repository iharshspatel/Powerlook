import React, {Component} from "react";

/* 
 * Component which serves the purpose of a "root route component". 
 */
class Page extends Component {
  constructor(props){
    super(props);
  }
  
  /**
   * Here, we define a react lifecycle method that gets executed each time 
   * our component is mounted to the DOM, which is exactly what we want in this case
   */
  componentDidMount() {
    document.title = this.props.title;
  }

  /**
   * Here, we use a component prop to render 
   * a component, as specified in route configuration
   */
  render() {
    const PageComponent = this.props.component;

    return (
      <PageComponent {...this.props} />
    )
  }
}

export default Page;