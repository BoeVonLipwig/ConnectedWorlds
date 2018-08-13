import React from "react";
import "../ContactButton.css";

class MailButton extends React.Component {
  data = ["Request Addition", "mailto", "mailto:matt.plummer@vuw.ac.nz"];

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = { menu: this.props.menu };
  }

  svg() {
    return (
      <svg
        version="1.1"
        className="svg-path"
        fill="#fff"
        width="20px"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 194.6 118"
      >
        <g>
          <path
            d="M194.6,21v76c0,11-10,21-21,21h-125c-11,0-21-10-21-21v-0.6h0.2c5,0,9-4,9-9v-7.5h5.4c5,0,9-4,9-9V58.7c0-5-4-9-9-9h-5.4
                  v-7.1c0-5-4-9-9-9h-0.2V21c0-3,1-6,2-9l63,52c10,9,26,9,36,1l64-53C193.6,15,194.6,18,194.6,21z"
          />
          <path d="M48.6,0h125c4,0,9,2,12,4l-63,53c-6,5-17,5-23,0l-63-53C39.6,2,43.6,0,48.6,0z" />
        </g>
        <g>
          <g>
            <polygon
              points="42.2,58.7 42.2,70.9 27.8,70.9 27.8,87.4 14.5,87.4 14.5,70.9 0,70.9 0,58.7 14.5,58.7 14.5,42.6 27.8,42.6 
                      27.8,58.7"
            />
          </g>
        </g>
      </svg>
    );
  }

  onClick() {
    if (this.state.menu) {
      this.props.parent.setState({
        ...this.props.parent.state,
        showMenu: false
      });
      window.open(this.data[2]);
    }
  }

  render() {
    let html = (
      <div className="ui-menu-item-wrapper">
        {this.data[0]}
        <span className={this.data[1]} />
        <span id="img-option">{this.svg()}</span>
      </div>
    );
    if (this.state.menu) {
      return (
        <li className="ui-menu-item" onClick={() => this.onClick()}>
          {html}
        </li>
      );
    } else {
      return html;
    }
  }
}

export default MailButton;
