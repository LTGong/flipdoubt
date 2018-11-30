import React, {Component} from 'react';
import "./ThoughtBubble.css";

class ThoughtBubble extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile: window.innerWidth < 1024,
      value: '',
      styleClass: 'thoughtText is-hidden',
      inputClass: 'add-padding',
      anotherThought: 'button is-info is-hidden',
      transformButton: "button is-info",
      processing: "is-hidden"
    };
    this.handleChange = this
        .handleChange
        .bind(this);
    this.transform = this
        .transform
        .bind(this);
    this.checkresults = this
        .checkresults
        .bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.showText = this.showText.bind(this);
    this.showInput = this.showInput.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    setInterval(() => { this.checkresults() }, 10000);
  }

  componentWillMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    if(window.innerWidth < 1024) {
      this.setState({mobile: true});
    } else {
      this.setState({mobile: false});
    }
  }

  handleChange(e) {
    this.setState({value: e.target.value})
    console.log(this.state.value)
  }

  handleClear (e) {
    this.setState({value: '', styleClass: "thougtText"})
  }

  showText(e) {
    console.log("we in this show text method yo");
    this.setState({
      value: this.state.value,
      styleClass: "thoughtText",
      inputClass: "is-hidden",
      anotherThought: 'button is-info',
      transformButton: 'button is-info is-hidden',
      processing: ''
    });
  }

  showInput(e) {
    e.preventDefault();
    this.setState({
      value: '',
      styleClass: "thoughtText is-hidden",
      inputClass: "add-padding",
      anotherThought: "button is-info is-hidden",
      transformButton: "button is-info",
      processing: 'is-hidden'
    });
  }

  transform() {
    if (this.props.isAuthenticated()){
      let thought = this.state.value;
      const the_headers = Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, this.props.getAuthorizationHeader());
      console.log('we transformin "' + thought + '"');

      this.showText();

      let turk_request = new Request('/api/mturk/transform', {
        method: 'POST',
        body: JSON.stringify({thoughtText: thought}),
        headers: the_headers
      });

      fetch(turk_request).then((res) => res.json()).then((res) => {
        console.log('In callback after mturk api call');
        let HITs_Created = [];
        let that = this;
        res.forEach(item => {
          HITs_Created.push({
            'text': thought,
            'user_name': that.props.profile.nickname,
            'processing': true,
            'HITId': item.HITId,
            'HITTypeId': item.HITTypeId
          })
        });

        let db_request = new Request('/api/db/create-new-thought', {
          method: 'POST',
          body: JSON.stringify(HITs_Created),
          headers: the_headers
        });

        fetch(db_request).then((res) => res.json()).then((res) => {
          let mongoIdString = res._id;
          console.log(mongoIdString);
        }).catch(err => console.log(err))

      }).catch(err => console.log(err))
    }
  }

  checkresults() {
    console.log('CHECKIN IN NOW');
    if(this.props.profile) {
      var values_from_turk = [];
      var the_headers = Object.assign({'Accept': 'application/json','Content-Type': 'application/json'}, this.props.getAuthorizationHeader());
      let get_hits_request = new Request('/api/db/get-processing-HITs', {
        'method': 'POST',
        'headers': the_headers,
        'body': JSON.stringify({ 'username': this.props.profile.nickname })
      });
      fetch(get_hits_request)
          .then(res => res.json())
          .then(results => {
            let checkin_request = new Request('/api/mturk/check-hits', {
              'method': 'POST',
              'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              'body': JSON.stringify({ 'HITIds': results })
            });

            fetch(checkin_request)
                .then((res) => res.json())
                .then((res) => {
                  if(!(res.length === 0)) {
                    values_from_turk = res;
                    let hitids = res.map((item) => item.HITId);
                    let url = new URL("/api/db/get-thoughts", window.location.origin);
                    const params = {HITIds: hitids};
                    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
                    const get_the_thoughts_for_hits = new Request(url.href, {
                      'method': 'GET',
                      'headers': the_headers
                    });
                    fetch(get_the_thoughts_for_hits)
                        .then((res)=> res.json())
                        .then((res)=> {
                          console.log("Results back from checkin_request\n",res);
                          let update_values = [];
                          for(let i = 0; i < values_from_turk.length; i++) {
                            for(let j = 0; j < res.length; j++) {
                              for(let k = 0; k < res[j]._HITs.length; k++) {
                                if(values_from_turk[i].HITId === res[j]._HITs[k].HITId) {
                                  update_values.push({
                                    id: res[j]._id,
                                    HITId: values_from_turk[i].HITId,
                                    positive_thought: values_from_turk[i].pos_thought
                                  })
                                }
                              }
                            }
                          }
                          let db_updates = new Request('/api/db/update-processed-HIT', {
                            'method': 'POST',
                            'headers': {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            },
                            'body': JSON.stringify(update_values)
                          });
                          fetch(db_updates)
                              .then((res)=> res.json())
                              .then((res)=> {
                                console.log("we gots the results yo");
                                this.props.reRenderHack();
                                this.props.notification();
                                // this.forceUpdate();
                                console.log(res);
                              })
                        });
                  } else {
                    console.log("no updates from turk yo");
                  }
                }).catch(err => console.log(err));
          })
          .catch(err => console.log(err));
    } else {
      console.log("cannot check results, the user is not logged in");
    }
  }

  render() {
    if(this.state.mobile) {
      return (
          <div className="section no-cloud ">
            <div className={this.state.inputClass}>
              <div className="field">
                <div className="control text-centered">
                  <textarea cols="12" rows="5" value={this.state.value} onChange={this.handleChange}
                            className="textarea" type="text" placeholder="Purge your thought."/>
                </div>
              </div>
            </div>
            <div className={this.state.styleClass}>{this.state.value}</div>
            <div className="control submit-for-cloud">
              <div className="submit-for-cloud-cell">
                <a className={this.state.transformButton} onClick={this.transform}>
                  Transform
                </a>
                <a className={this.state.anotherThought} onClick={this.showInput}>
                  Add Another Thought
                </a>
                <div className={this.state.processing}>Your thought is processing...</div>
              </div>
            </div>
          </div>
      )
    } else {
      return (
          <div className="cloud">
            <div className="thought">
              <div className={this.state.inputClass}>
                <div className="field">
                  <div className="control text-centered">
                                  <textarea rows="5" cols="12" value={this.state.value}
                                            disabled={this.props.isAuthenticated() ? "" : "true"}
                                            onChange={this.handleChange}
                                            className="textarea"
                                            placeholder={this.props.isAuthenticated() ? "Purge your thought." : "Login to purge a thought."} />
                  </div>
                </div>
              </div>
              <div className={this.state.styleClass}>{this.state.value}</div>
              <div className="control submit-for-cloud">
                <div className="submit-for-cloud-cell">
                  <a className={this.state.transformButton}
                     disabled={this.props.isAuthenticated() ? "" : "true"}
                     onClick={this.transform}>
                    Transform
                  </a>
                  <a className={this.state.anotherThought} onClick={this.showInput}>
                    Add Another Thought
                  </a>
                  <div className={this.state.processing}>Your thought is processing...</div>
                </div>
              </div>
            </div>
          </div>
      )
    }
  }
}

export default ThoughtBubble;
