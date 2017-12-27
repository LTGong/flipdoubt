import React, {Component} from 'react';
import './flip.css';
import background1 from '../Gallery/background-1.jpg';
import background2 from '../Gallery/background-2.jpg';
import background3 from '../Gallery/background-3.jpg';
import background4 from '../Gallery/background-4.jpg';
import background5 from '../Gallery/background-5.jpg';
import background6 from '../Gallery/background-6.jpg';
import background7 from '../Gallery/background-7.jpg';
import background8 from '../Gallery/background-8.jpg';
import background9 from '../Gallery/background-9.jpg';
import background10 from '../Gallery/background-10.jpg';
import background11 from '../Gallery/background-11.jpg';
import background12 from '../Gallery/background-12.jpg';
import background13 from '../Gallery/background-13.jpg';
import background14 from '../Gallery/background-14.jpg';
import background15 from '../Gallery/background-15.jpg';


class Flip extends Component {

    constructor(props) {
        super(props);
        this.state = {
          neg1: 'NOTHING',
          neg2: 'NOTHING',
          neg3: 'NOTHING',
          value: '',
        }
        this.fetchThoughtReframe = this.fetchThoughtReframe.bind(this);
        this.handleChange =this.handleChange.bind(this);
        this.getBackground = this.getBackground.bind(this);
    }

    componentWillMount() {
        this.fetchThoughtReframe();
    }

    handleChange(e) {
      this.setState({value: e.target.value})
      console.log(this.state.value)
    }

    fetchThoughtReframe() {
      var the_headers = Object.assign({
        Accept: "application/json",
        "Content-Type": "application/json"
      });
      var user = this.props.profile.nickname;

      let get_reframe = new Request(
        'api/db/get-thoughts-to-reframe',
        {
          method: "POST",
          headers: the_headers,
          body: JSON.stringify({ username: user })
        }
      );

      fetch(get_reframe)
        .then(res => res.json())
        .then(results => {
          this.setState({ neg1: results[0], neg2: results[1], neg3: results[2] });
        })
        .catch(err => console.log(err));
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
            case 11:
                return background11;
            case 12:
                return background12;
            case 13:
                return background13;
            case 14:
                return background14;
            case 15:
                return background15;
            default:
                return background1;
        }
    }

    render() {
     let thoughtText = [this.state.neg1._neg_thought, this.state.neg2._neg_thought, this.state.neg3._neg_thought];
     let i=0;
     let renderThoughts = []
     for (i; i<3; i++) {
       renderThoughts.push(
         <li>{thoughtText[i]}</li>
       )
     }
     let setsOfThree = [[1,2,3], [4,5,6],[7,8,9],[10,11,12],[13,14,15]];
     let templates = [];
     for (i = 0; i < setsOfThree.length; i++) {
         templates.push(setsOfThree[i].map((img_id, i) => {
             return (
                 <div className="column is-4">
                     <div className="card-container">
                         <div className="custom-card" onClick={this.handleCardClick}>
                             <figure className="front">
                                 <img src={this.getBackground(img_id)} alt="front"/>
                             </figure>
                         </div>
                     </div>
                 </div>
             );
         }));
     }

     var imgs_template = templates.map((template, i) => <div className="columns">
         {template}
     </div>);


        return (
            <div className="box dark has-text-centered is-radiusless">
                <h2 className="card-header title is-3 has-text-centered">Community Flipping</h2>
                <div>
                <p>Negative Thoughts from Flip*Doubt Community Members</p>
                <ul>{renderThoughts}</ul>
                </div>
                <p>Input Text for Positive Thought</p>
                <div className="field">
                  <div className="control text-centered">
                    <textarea rows="5" cols="15" value={this.state.value} onChange={this.handleChange} className="textarea" type="text" placeholder="Flip the thought here." />
                  </div>
                </div>
                <h2 className="card-header title is-3 has-text-centered">Select an Image</h2>
                <br/> {imgs_template}
            </div>
        );
    }
}

export default Flip;
