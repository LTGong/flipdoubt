import React, { Component } from "react";
import "./user.css";
import FusionCharts from "fusioncharts";
// Load the charts module
import charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import ReactDOM from "react-dom";
import SummaryTable from "../SummaryTable";;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.profile,
      _prior_7_days: [],
      _prior_7_days_counts_pos: [],
      _prior_7_days_counts_neg: [],
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
          console.log(res);
          this.setState({
            _prior_7_days: res[0],
            _prior_7_days_counts_pos: res[1],
            _prior_7_days_counts_neg: res[2],
            _thoughts: res[3]
          });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    charts(FusionCharts);
    var myDataSource = {
      chart: {
        caption: "Thought Trends",
        subcaption: "Past 7 Days",
        xaxisname: "Date",
        yaxisname: "Count",
        // numberprefix: "$",
        theme: "ocean"
      },
      categories: [
        {
          category: this.state._prior_7_days
        }
      ],
      dataset: [
        {
          seriesname: "NEGATIVE THOUGHTS",
          data: this.state._prior_7_days_counts_neg
        },
        {
          seriesname: "POSITIVE THOUGHTS",
          renderas: "area", //or line
          showvalues: "0",
          data: this.state._prior_7_days_counts_pos
        }
      ]
    };
    var props_multi_chart = {
      id: "multi_chart",
      type: "mscombi2d",
      width: "100%",
      height: 400,
      dataFormat: "json",
      dataSource: myDataSource
    };

    console.log(this.state._prior_7_days_counts_neg);
    console.log(this.props.profile);
    const timestamp = this.props.profile.updated_at.split("T")[0];

    return (
      <div className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-one-third">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src="https://ecurrent.fit.edu/files/2014/11/Smiley-face-in-sea-of-sad-faces.png"
                      alt="Placeholder"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48">
                        <img
                          src={this.props.profile.picture}
                          alt="Placeholder"
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">{this.props.profile.name}</p>
                      <p className="subtitle is-6">
                        @{this.props.profile.nickname}
                      </p>
                    </div>
                  </div>

                  <div className="content">
                    I didn't come this far,
                    <br />
                    just to come this far.
                    <br />
                    <time dateTime={timestamp}>~{timestamp} </time>
                  </div>
                  <div className="social">
                    <i className="fa fa-facebook-square" aria-hidden="true" />
                    <i className="fa fa-twitter-square" aria-hidden="true" />
                    <i className="fa fa-pinterest-square" aria-hidden="true" />
                    <i className="fa fa-tumblr-square" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-two-thirds">
              <ReactFC {...props_multi_chart} />
              <br />
              <SummaryTable {...this.props}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
