import React, { Component } from "react";
import "./user.css";
import FusionCharts from "fusioncharts";
// Load the charts module
import charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import ReactDOM from "react-dom";
import SummaryTable from "../SummaryTable";;

// Pass fusioncharts as a dependency of charts
charts(FusionCharts)


  var myDataSource = {
    chart: {
      caption: "Trend of thoughts",
      subcaption: "Breakdown by month",
      xaxisname: "Month",
      yaxisname: "Frequency (In count)",
      // numberprefix: "$",
      theme: "ocean"
    },
    categories: [
      {
        category: [
          {
            label: "Jan"
          },
          {
            label: "Feb"
          },
          {
            label: "Mar"
          },
          {
            label: "Apr"
          },
          {
            label: "May"
          },
          {
            label: "Jun"
          },
          {
            label: "Jul"
          },
          {
            label: "Aug"
          },
          {
            label: "Sep"
          },
          {
            label: "Oct"
          },
          {
            label: "Nov"
          },
          {
            label: "Dec"
          }
        ]
      }
    ],
    dataset: [
      {
        seriesname: "Total number of times",
        data: [
          {
            value: "16"
          },
          {
            value: "20"
          },
          {
            value: "18"
          },
          {
            value: "19"
          },
          {
            value: "15"
          },
          {
            value: "21"
          },
          {
            value: "16"
          },
          {
            value: "20"
          },
          {
            value: "17"
          },
          {
            value: "25"
          },
          {
            value: "19"
          },
          {
            value: "23"
          }
        ]
      },
      {
        seriesname: "Trend",
        renderas: "line",
        showvalues: "0",
        data: [
          {
            value: "15"
          },
          {
            value: "16"
          },
          {
            value: "17"
          },
          {
            value: "18"
          },
          {
            value: "19"
          },
          {
            value: "19"
          },
          {
            value: "19"
          },
          {
            value: "19"
          },
          {
            value: "20"
          },
          {
            value: "21"
          },
          {
            value: "22"
          },
          {
            value: "23"
          }
        ]
      },
      {
        seriesname: "Helping others",
        renderas: "area",
        showvalues: "0",
        data: [
          {
            value: "4"
          },
          {
            value: "5"
          },
          {
            value: "3"
          },
          {
            value: "4"
          },
          {
            value: "1"
          },
          {
            value: "7"
          },
          {
            value: "1"
          },
          {
            value: "4"
          },
          {
            value: "1"
          },
          {
            value: "8"
          },
          {
            value: "2"
          },
          {
            value: "7"
          }
        ]
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


class User extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    console.log(this.props.profile);
    const timestamp = this.props.profile.updated_at.split('T')[0];

    return <div className="section">
        <div className="container">
          <div className="columns is-multiline">
            <div className="column is-one-third">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src="https://ecurrent.fit.edu/files/2014/11/Smiley-face-in-sea-of-sad-faces.png" alt="Placeholder" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48">
                        <img src={this.props.profile.picture} alt="Placeholder" />
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
                    <time datetime={timestamp}>~{timestamp} </time>
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
              <SummaryTable />
            </div>
          </div>
        </div>
      </div>;
  }
}

export default User;