import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';



export class News extends Component {
  static defaultProps={
    country:'in',
    pageSize: 8,
    category:'general'
  }
  static propTypes={
    country :PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  capitlizeText=(string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title=`${this.capitlizeText(this.props.category)} - NewsMonkey`
  }
  async newsUpdate(){
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c356d1332f9b4f12848ecaa78ef32931&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json();
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false,
    });
    
  }
  async componentDidMount() {
    this.newsUpdate()
  }
  handlePreviousClick = async () => {
    this.setState({page:this.state.page-1});
    this.newsUpdate();
  };

  handleNextClick = async () => {
   
    
    this.setState({page:this.state.page + 1});
    this.newsUpdate();
  };
  render() {
    return (
      <div className="container my-3" >
        <h1 className="text-center" style={{margin:"25px"}} >NewsMonkey-Top  {this.capitlizeText(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  {/* //when we use map need to provide unique key */}
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 45)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>
        <div className="d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            className="btn btn-dark btn-sm"
            onClick={this.handlePreviousClick}
          >
            {" "}
            &larr; Previous{" "}
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            className="btn btn-sm btn-dark "
            onClick={this.handleNextClick}
          >
            Next &rarr;{" "}
          </button>
        </div>
      </div>
    );
  }
}
export default News;
