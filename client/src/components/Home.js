import React,{Component} from 'react';

import axios from "axios";

class Home extends Component {
  state = {
    cars: [],
  };

  componentDidMount() {
    axios
      .get("http://127.0.0.1:5000/api/cars")
      .then((response) => {
        console.log("Car data:", response.data);
        this.setState({ cars: response.data });
        setTimeout(() => {
          window.updateCarousel();
          window.reRenderRangeSlider();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching car data:", error);
      });
  }

  render() {
    const { cars } = this.state;

    return (
      <div className="wrap-body-inner">
        <div className="product product-grid product-grid-2 car m-t-lg-90 p-t-sm-35 m-b-lg-20">
          <div className="heading">
            <h3>RECENT CARS</h3>
          </div>
          <div className="row">
            <div
              id="fifi"
              data-items="3"
              data-itemsdesktop="2"
              data-itemsdesktopsmall="2"
              data-itemstablet="2"
              data-itemsmobile="1"
              data-pag="false"
              data-buttons="true"
            >
              {cars.map((car) => (
                <div className="col-lg-6 col-md-12" key={car._id}>
                  <div
                    className="product-item hover-img"
                    style={{ maxWidth: "600px", marginBottom: "20px" }}
                  >
                    <a className="product-img">
                      <img
                        src={`http://127.0.0.1:5000/public/${car.imageName}`}
                        alt={car.name}
                        width="600"
                        height="400"
                        style={{
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    </a>
                    <div className="product-caption">
                      <h4 className="product-name">
                        <a>
                          {car.name.toUpperCase()} / <b>{car.condition}</b>
                        </a>
                        <span className="f-18">
                          Rs. {new Intl.NumberFormat("en-IN").format(car.price)}
                        </span>
                      </h4>
                    </div>
                    <ul className="absolute-caption">
                      <li>
                        <i className="fa fa-clock-o" /> {car.year}
                      </li>
                      <li>
                        <i className="fa fa-car" /> {car.transition}
                      </li>
                      <li>
                        <i className="fa fa-road" /> {car.body}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="banner-item banner-2x banner-bg-9 color-inher m-b-lg-50">
          <h3 className="f-weight-300">
            Start Selling With <strong>AutoShop</strong> Now!
          </h3>
          <p>No hidden fees or costs, you pay what you need.</p>
          <a className="ht-btn ht-btn-default">Click to sell your car</a>
        </div>
      </div>
    );
  }
}


export default Home ;