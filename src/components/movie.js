import React, { Component }  from 'react';
import {connect} from "react-redux";
import { Glyphicon, Panel, ListGroup, ListGroupItem, Col, Form, FormGroup, FormControl, ControlLabel, Button  } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import {submitForm} from "../actions/movieActions";

//support routing by creating a new component

class Movie extends Component {

    constructor(props){
        super(props);

        this.updateDetails = this.updateDetails.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {
            details:{
                movieId : '',
                username: '',
                quote: '',
                rating: ''
            }
        };
        this.state.details.username= super.state.auth.username;
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    //******************** REVIEW FORM CODE *****************************

    updateDetails(event) {
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }


    submit(){
        const {dispatch} = this.props;
        dispatch(submitForm(this.state.details));
    }

    //*******************************************************************

    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            )
        }

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.username}</b> {review.quote}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            )
        }

        const ReviewForm = ({movieId}) => {
            this.state.details.movieId = movieId;
            return (
                <Form horizontal>

                    <FormGroup controlId="quote">
                        <Col componentClass={ControlLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.username} type="text" placeholder="Review" />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="rating">
                        <Col componentClass={ControlLabel} sm={2}>
                            Rating
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.password} type="password" placeholder="Rating 1-5" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.submitForm}>Submit Review</Button>
                        </Col>
                    </FormGroup>
                </Form>
            )
        }


        //********************************************************************

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { //if not could still be fetching the movie
                return <div>Loading...</div>;
            }
            return (
              <Panel>
                  <Panel.Heading>Movie Detail</Panel.Heading>
                  <Panel.Body><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                  <ListGroup>
                      <ListGroupItem>{currentMovie.title}</ListGroupItem>
                      <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                      <ListGroupItem><h4><Glyphicon glyph={'star'}/> {currentMovie.avgRating} </h4></ListGroupItem>
                  </ListGroup>
                  <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
                  <Panel.Body><ReviewForm movieId={currentMovie.id}/></Panel.Body>
              </Panel>
            );
        }

        return (
            <DetailInfo currentMovie={this.props.selectedMovie} />
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));