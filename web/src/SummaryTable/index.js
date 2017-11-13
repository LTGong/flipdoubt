import React, { Component } from "react";
import "./summaryTable.css";

class SummaryTable extends Component {
  constructor(props) {
    super(props);
      this.state = { 
        user: this.props.profile,
        _thoughts: [] 
      };
  }

  componentWillMount() {
    console.log("in User, to get total");
    if (this.state.user) {
      var the_headers = Object.assign(
        { Accept: "application/json", "Content-Type": "application/json" },
        this.props.getAuthorizationHeader()
      );
      let db_get_totals = new Request("/api/db/get-totals", {
        method: "POST",
        body: JSON.stringify({ user: this.props.profile.nickname }),
        headers: the_headers
      });

      fetch(db_get_totals)
        .then(res => res.json())
        .then(res => {
          console.log("logging res.json()");
          console.log(res[3]);
          this.setState({
            _thoughts: res[3]
          });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    let eachThought = this.state._thoughts[0];
    console.log(eachThought);
    // console.log(eachThought._neg_thought);
    // var eachThought = templates.map((template, i) => <tr>
    //     <td width="5%">
    //       <i className="fa fa-frown-o has-text-danger" aria-hidden="true" />
    //     </td>
    //     <td>{this.state._thoughts[0]._neg_thought}</td>
    //     <td>{this.state._thoughts[0]._neg_thought_timestamp.length}</td>
    //     <td className="right-border">
    //       <i className="fa fa-plus" aria-hidden="true" />
    //     </td>
    //     <td width="5%">
    //       <i className="fa fa-smile-o has-text-success" aria-hidden="true" />
    //     </td>
    //     <td>{this.state._thoughts[0]._pos_thought}</td>
    //     <td>{this.state._thoughts[0]._pos_thought_timestamp.length}</td>
    //     <td>
    //       <i className="fa fa-plus" aria-hidden="true" />
    //     </td>
    //   </tr>);
    return <div className="card events-card">
        <header className="card-header">
          <p className="card-header-title is-centered">
            Summary Stats of My Thoughts
          </p>
          <a href="#" className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fa fa-angle-down" aria-hidden="true" />
            </span>
          </a>
        </header>
        <div className="card-table">
          <div className="content">
            <table className="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th />
                  <th>Negative Thought</th>
                  <th>Count</th>
                  <th>Add</th>
                  <th />
                  <th>Positive Thought</th>
                  <th>Count</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody>
                <tr className="is-inprocess">
                  <td width="5%">
                    <i className="fa fa-frown-o has-text-danger" />
                  </td>
                  <td>Negative thought (in process) </td>
                  <td>1</td>
                  <td className="right-border">
                    <i className="fa fa-plus" aria-hidden="true" />
                  </td>
                  <td width="5%">
                    <i className="fa fa-smile-o has-text-success" />
                  </td>
                  <td>Waiting for MTurk response</td>
                  <td>0</td>
                  <td>
                    <i className="fa fa-plus" aria-hidden="true" />
                  </td>
                </tr>
                {/* <tr>
                  <td width="5%">
                    <i className="fa fa-frown-o has-text-danger" aria-hidden="true" />
                  </td>
                  <td>{this.state._thoughts._neg_thought}</td>
                  <td>
                    {this.state._thoughts._neg_thought_timestamp.length}
                  </td>
                  <td className="right-border">
                    <i className="fa fa-plus" aria-hidden="true" />
                  </td>
                  <td width="5%">
                    <i className="fa fa-smile-o has-text-success" aria-hidden="true" />
                  </td>
                  <td>{this.state._thoughts._pos_thought}</td>
                  <td>
                    {this.state._thoughts._pos_thought_timestamp.length}
                  </td>
                  <td>
                    <i className="fa fa-plus" aria-hidden="true" />
                  </td>
                </tr> */}


                {/* <tr>
                    <td width="5%">
                      <i className="fa fa-frown-o has-text-danger" aria-hidden="true" />
                    </td>
                    <td>Negative thought 2</td>
                    <td>6</td>
                    <td className="right-border">
                      <i className="fa fa-plus" aria-hidden="true" />
                    </td>
                    <td width="5%">
                      <i className="fa fa-smile-o has-text-success" aria-hidden="true" />
                    </td>
                    <td>Positive thought 2</td>
                    <td>10</td>
                    <td>
                      <i className="fa fa-plus" aria-hidden="true" />
                    </td>
                  </tr>
                  <tr>
                    <td width="5%">
                      <i className="fa fa-frown-o has-text-danger" aria-hidden="true" />
                    </td>
                    <td>Negative thought 3</td>
                    <td>8</td>
                    <td className="right-border">
                      <i className="fa fa-plus" aria-hidden="true" />
                    </td>
                    <td width="5%">
                      <i className="fa fa-smile-o has-text-success" aria-hidden="true" />
                    </td>
                    <td>Positive thought 3</td>
                    <td>7</td>
                    <td>
                      <i className="fa fa-plus" aria-hidden="true" />
                    </td>
                  </tr> */}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="card-footer">
          {/* <a href="#" className="card-footer-item">
              View All
            </a> */}
        </footer>
      </div>;
  }
}

export default SummaryTable;

