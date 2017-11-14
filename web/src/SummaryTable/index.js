import React, {Component} from "react";
import "./summaryTable.css";

class SummaryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thoughts: []
    }
  }

  componentWillMount() {

    var the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());

    if (this.props.profile.nickname != null) {
      let request = new Request('/api/db/get-user-thought-summary', {
        method: 'POST',
        body: JSON.stringify({username: this.props.profile.nickname}),
        headers: the_headers
      });

      fetch(request).then((res) => res.json()).then((res) => {
        this.setState({thoughts: res});
      }).catch(err => console.log(err));
    }

  }

  render() {
    var summary_table_template = this.state.thoughts.map((thought, i) => {
        return <tr className="is-inprocess">
        <td width="5%">
          <i className="fa fa-frown-o has-text-danger"/>
        </td>
        <td>{thought._neg_thought}
        </td>
        <td>{thought._neg_thought_timestamps_count}</td>
        <td width="5%">
          <i className="fa fa-smile-o has-text-success"/>
        </td>
        <td>{thought._pos_thought}</td>
        <td>{thought._pos_thought_timestamps_count}</td>
      </tr>
    });

    return (
      <div className="card events-card">
        <header className="card-header">
          <p className="card-header-title is-centered">
            Summary of My Thoughts
          </p>
        </header>
        <div className="card-table">
          <div className="content">
            <table className="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th/>
                  <th>Negative Thought</th>
                  <th>Count</th>
                  <th/>
                  <th>Positive Thought</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                  {summary_table_template}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}

export default SummaryTable;
