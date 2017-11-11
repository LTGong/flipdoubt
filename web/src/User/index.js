import React, { Component } from "react";
import "./user.css";
import FusionCharts from "fusioncharts";
// Load the charts module
import charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import ReactDOM from "react-dom";
// Pass fusioncharts as a dependency of charts
charts(FusionCharts)

  var myDataSource = {
    chart: {
      caption: "Trend of thoughts",
      subcaption: "Breakdown by month",
      xaxisname: "Month",
      yaxisname: "Frequency (In count)",
      // numberprefix: "$",
      theme: "ocean",

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
  }};

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
    this.state = {
      user : this.props.profile
    }
  }

  render() {

    if (this.state.user){
      var the_headers = Object.assign({'Accept': 'application/json','Content-Type': 'application/json'}, this.props.getAuthorizationHeader());
      let db_get_totals = new Request('/api/db/get-totals', {
        method: 'POST',
        body: JSON.stringify({'user' : this.props.profile.nickname}),
        headers: the_headers
      });

      fetch(db_get_totals).then((res) => res.json()).then((res) => {
        console.log(res);
      }).catch(err => console.log(err));
    }

    console.log(this.props.profile);
    const timestamp = this.props.profile.updated_at.split('T')[0];

    return <div className="section">
        <div className="container">
          <div class="columns">
            <div class="column is-one-third">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="https://ecurrent.fit.edu/files/2014/11/Smiley-face-in-sea-of-sad-faces.png" alt="Placeholder" />
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img src={this.props.profile.picture} alt="Placeholder" />
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">{this.props.profile.name}</p>
                      <p class="subtitle is-6">
                        @{this.props.profile.nickname}
                      </p>
                    </div>
                  </div>

                  <div class="content">
                    I didnt come this far,
                    {/* <a>@bulmaio</a>.
                    <a href="#">#css</a> <a href="#">#responsive</a> */}
                    <br />
                    just to come this far.
                    <br />
                    <time datetime={timestamp}>~{timestamp} </time>
                  </div>
                  <div class="social">
                    <i class="fa fa-facebook-square" aria-hidden="true" />
                    <i class="fa fa-twitter-square" aria-hidden="true" />
                    <i class="fa fa-pinterest-square" aria-hidden="true" />
                    <i class="fa fa-tumblr-square" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <ReactFC {...props_multi_chart} />
              {/* <div class="columns">
                <div class="column is-one-third" />
                <div class="column">2</div>
                <div class="column">3</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>;
  }
}

export default User;
