import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './gallery.css';
import background1 from './background-1.jpg';
import background2 from './background-2.jpg';
import background3 from './background-3.jpg';
import background4 from './background-4.jpg';
import background5 from './background-5.jpg';
import background6 from './background-6.jpg';
import background7 from './background-7.jpg';
import background8 from './background-8.jpg';
import background9 from './background-9.jpg';
import background10 from './background-10.jpg';
import background11 from './background-11.jpg';

var share = require('social-share');

class Gallery extends Component {

  constructor(props) {
      super(props);
      this.state = {
        showCarousel: window.innerWidth <= 1024,
        currentShownPage: 0,
        thoughts: [],
        totalPages: null
      }
      this.handleCardClick = this
          .handleCardClick
          .bind(this);
      this.swap = this
          .swap
          .bind(this);
      this.handleShareClick = this
          .handleShareClick
          .bind(this);
      this.handlePositiveClick = this
          .handlePositiveClick
          .bind(this);
      this.handleNegativeClick = this
          .handleNegativeClick
          .bind(this);
      this.handleTwitterClick = this
          .handleTwitterClick
          .bind(this);
      this.showNextPage = this.showNextPage.bind(this);
      this.showPreviousPage = this.showPreviousPage.bind(this);
      this.updateDimensions = this.updateDimensions.bind(this);
      this.reRenderState = false;
  }

  updateDimensions() {
    if(window.innerWidth > 1024) {
      this.setState({showCarousel: false});
    } else {
      this.setState({showCarousel: true});
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.fetchThoughts();
  }

  componentWillUpdate() {
      if (!this.reRenderState) {
          this.reRenderState = this.props.reRender;
          if (this.reRenderState) {
              this.props.stopReRendering();
              this.fetchThoughts();
          }
      }
  }

  fetchThoughts() {
      let the_headers = Object.assign({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }, this.props.getAuthorizationHeader());
      if (this.props.user != null) {
          let request = new Request('/api/db/get-user-quotes', {
              method: 'POST',
              body: JSON.stringify({username: this.props.user}),
              headers: the_headers
          });

      console.log(request);
      fetch(request).then((res) => res.json()).then((res) => {
        res.forEach((item) => {
          for(let i = 0; i < item._HITs.length; i++) {
            if(item._HITs[i].positive_thought !== undefined
                && item._pos_thought === undefined) {
              item['_pos_thought'] = item._HITs[i].positive_thought;
            }
          }
        });
        this.setState({
          thoughts: res,
          totalPages: res.length === 3.0 ? 0 : Math.ceil(res.length/3.0),
          lowerBound: 0,
          upperBound: 1
        });
        this.reRenderState = false;
      }).catch(err => console.log(err));
  }
  }

  showNextPage(gallery_template) {
    if(this.state.currentShownPage < (this.state.totalPages - 1)) {
      this.setState({currentShownPage: this.state.currentShownPage + 1})
    } else if(this.state.currentShownPage === (this.state.totalPages - 1)) {
      this.setState({currentShownPage: 0})
    }
    let upper_bound = 0;
    let lower_bound = 0;
    if(this.state.upperBound === gallery_template.length) {
      this.setState({lowerBound: 0});
      this.setState({upperBound: 1});
    } else {
      upper_bound = (this.state.upperBound > gallery_template.length) ? gallery_template.length : this.state.upperBound + 1;
      lower_bound = upper_bound -1;
      this.setState({lowerBound: lower_bound});
      this.setState({upperBound: upper_bound});
    }
  }

  showPreviousPage(gallery_template) {
    let current_page = 0;
    if(this.state.currentShownPage > 0) {
      this.setState({currentShownPage: (this.state.currentShownPage - 1)})
      current_page = this.state.currentShownPage - 1;
    } else if(this.state.currentShownPage === 0) {
      this.setState({currentShownPage: this.state.totalPages - 1})
      current_page = this.state.totalPages - 1
    }
    let upper_bound = 0;
    let lower_bound = 0;
    if(current_page === (this.state.totalPages - 1)) {
      upper_bound = gallery_template.length;
      lower_bound = upper_bound - 1;
      this.setState({upperBound: upper_bound});
      this.setState({lowerBound: lower_bound});
    } else {
      upper_bound = this.state.upperBound - 1;
      lower_bound = upper_bound - 1;
      this.setState({upperBound: upper_bound});
      this.setState({lowerBound: lower_bound});
    }
  }

  handleCardClick(e) {
      e.preventDefault();
      if (e.currentTarget.className.includes('flipped')) {
          e.currentTarget.className = "custom-card";
      } else {
          e.currentTarget.className = "custom-card flipped";
      }
  }

  handleTwitterClick(e) {
      console.log("child click");
      e.stopPropagation();
      var url = share('twitter', {
          title: e
              .currentTarget
              .getAttribute('value')
      });

      this.bounce(e.currentTarget);
      window.open(url, "_blank");
  }

  handleShareClick(e) {
      e.stopPropagation();
    let the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());
    let share_request = new Request('/api/db/share-thought', {
          method: 'POST',
          body: JSON.stringify({
              _HITId: e
                  .currentTarget
                  .getAttribute('value')
          }),
          // this header sends the user token from auth0
          headers: the_headers
      });
      fetch(share_request).then((res) => res.json()).then((res) => {
          console.log(res.message);
      }).catch(err => console.log(err));

      this.bounce(e.currentTarget);
  }

  handlePositiveClick(e) {
      e.stopPropagation();

    let the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());

    let increment_positive_req = new Request('/api/db/increment_pos_thought', {
          method: 'POST',
          body: JSON.stringify({
              _HITId: e
                  .currentTarget
                  .getAttribute('value')
          }),
          headers: the_headers
      });

      fetch(increment_positive_req).then((res) => res.json()).then((res) => {
          console.log(res.message);
      }).catch(err => console.log(err));

      this.bounce(e.currentTarget);
  }

  handleNegativeClick(e) {
      e.stopPropagation();

    let the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());

    let increment_negative_req = new Request('/api/db/increment_neg_thought', {
          method: 'POST',
          body: JSON.stringify({
              _HITId: e
                  .currentTarget
                  .getAttribute('value')
          }),
          // this header sends the user token from auth0
          headers: the_headers
      });

      fetch(increment_negative_req).then((res) => res.json()).then((res) => {
          console.log(res.message);
      }).catch(err => console.log(err));

      this.bounce(e.currentTarget);
  }

  bounce(element) {
      element
          .classList
          .remove("bounce");
      element
          .classList
          .add("bounce");
  }

  swap(e) {
      console.log('swap');
      e.stopPropagation();
    const the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());
    const img = e.currentTarget.parentElement.parentElement.parentElement.children[0];
    let img_request = new Request('/api/db/swap-image', {
          method: 'POST',
          body: JSON.stringify({
              _HITId: e
                  .currentTarget
                  .getAttribute('value')
          }),
          // this header sends the user token from auth0
          headers: the_headers
      });

      fetch(img_request).then((res) => res.json()).then((res) => {
          img.src = this.getBackground(res._img_id);
      }).catch(err => console.log(err));

      this.bounce(e.currentTarget);
  }

  getBackground(img_id) {
      switch (img_id) {
          case 1:
              return background1;
          case 2:
              return background2;
          case 3:
              return background3;
          case 4:
              return background4;
          case 5:
              return background5;
          case 6:
              return background6;
          case 7:
              return background7;
          case 8:
              return background8;
          case 9:
              return background9;
          case 10:
              return background10;
          default:
              return background1;
      }
  }

  getThoughtsInSetsOfThree(thoughts) {
    let setsOfThree = [];
    let i = 0;
    while (i < this.state.thoughts.length) {
      setsOfThree.push(this.state.thoughts.slice(i, i + 3));
      i += 3
    }
    return setsOfThree;
  }

  getCircleIcons() {
    let circles = [];
    for(let i = 0; i < this.state.totalPages; i++) {
      const currentColor = this.state.currentShownPage === i ? "#000000" : "#FFFFFF";
      circles.push((<FontAwesomeIcon key={i} className="circles" style={{color: currentColor}} icon="circle" />));
    }
    return ( <div className="circles-container">{circles}</div> )
  }

  render() {
    let gallery_template;
    let setsOfThree;
    let templates;
    if(this.state.showCarousel) {
      if(this.state.thoughts.length === 0) {
        return(
            <div/>
        );
      } else {
        setsOfThree = this.getThoughtsInSetsOfThree(this.state.thoughts);
        templates = [];
        for(var i = 0; i < setsOfThree.length; i++) {
          templates.push(setsOfThree[i].map((thought, i) => {
            return (
                <div className="column is-4" key={i}>
                  <div className="custom-card" key={i} onClick={this.handleCardClick}>
                    <figure className="front">
                      <img src={this.getBackground(thought._img_id)} alt="front"/>
                      <div className="caption">
                        <h3>{thought._pos_thought}</h3>
                      </div>
                      <div className="share-social">
                        <i className="fa fa-exchange"
                           aria-hidden="true"
                           value={thought._HITId}
                           onClick={this.swap}/>
                      </div>
                    </figure>
                    <figure className="is-overlay back">
                      <img src={background11} alt="back"/>
                      <div className="caption">
                        <h3 className="negative">{thought._neg_thought}</h3>
                      </div>
                    </figure>
                  </div>
                </div>
            )
          }));
        }
        gallery_template = templates.map((template, i) => <div key={i} className="columns">
          {template}
        </div>);
        const circles = this.getCircleIcons();
        return (
            <div className="is-centered section">
              <div className="box dark carousel-container">
                <h2 className="title is-3 makeWhite has-text-centered" style={{"width": "100%"}}>Gallery of the Mind</h2>
                {gallery_template.slice(this.state.lowerBound, this.state.upperBound)}
                <div className="control-container">
                  <div className="page-controls"><FontAwesomeIcon onClick={this.showPreviousPage.bind(this, gallery_template)} className="pull-right" icon="angle-left" size="3x" /></div>
                  {circles}
                  <div className="page-controls"><FontAwesomeIcon onClick={this.showNextPage.bind(this, gallery_template)} className="pull-left" icon="angle-right" size="3x" /></div>
                </div>
              </div>
            </div>
        );
      }
    } else {
      if(this.state.thoughts.length === 0) {
        return(
           <div/>
        );
      } else {
        setsOfThree = this.getThoughtsInSetsOfThree(this.state.thoughts);
        templates = [];
        for (i = 0; i < setsOfThree.length; i++) {
          templates.push(setsOfThree[i].map((thought, i) => {
            return (
                <div className="column is-4" key={i}>
                  <div className="card-container">
                    <div className="custom-card" onClick={this.handleCardClick}>
                      <figure className="front">
                        <img src={this.getBackground(thought._img_id)} alt="front"/>
                        <div className="caption">
                          <h3>{thought._pos_thought}</h3>
                        </div>
                        <div className="share-social">
                          <i className="fa fa-exchange"
                             aria-hidden="true"
                             value={thought._HITId}
                             onClick={this.swap}/>
                        </div>
                      </figure>
                      <figure className="is-overlay back">
                        <img src={background11} alt="back"/>
                        <div className="caption">
                          <h3 className="negative">{thought._neg_thought}</h3>
                        </div>
                      </figure>
                    </div>
                  </div>
                </div>
            );
          }));
        }
        gallery_template = templates.map((template, i) => <div key={i} className="columns">
          {template}
        </div>);
        return (
            <div className="box dark has-text-centered is-radiusless">
              <p>{this.props.shouldRerender}</p>
              <h2 className="card-header title is-3 has-text-centered">Gallery of the Mind</h2>
              <br/> {gallery_template}
            </div>
        );
      }
    }
  }
}

export default Gallery;
