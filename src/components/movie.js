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
            currentMovie: '',
            details:{
                quote: '',
                rating: ''
            }
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }

        this.hydrateStateWithLocalStorage();
        this.setState({currentMovie : this.props.selectedMovie });
        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

    }

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        // saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    }

    hydrateStateWithLocalStorage() {
        // for all items in state
        for (let key in this.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    this.setState({ [key]: value });
                } catch (e) {
                    // handle empty string
                    this.setState({ [key]: value });
                }
            }
        }
    }

    saveStateToLocalStorage() {
        // for every item in React state
        for (let key in this.state) {
            // save to localStorage
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }

    //******************** REVIEW FORM CODE *****************************

    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    submit(){
        const {dispatch} = this.props;
        let details = {

            movieId : this.props.match.params.movieId,
            quote: this.state.details.quote,
            rating: this.state.details.rating

        };

        dispatch(submitForm(details, this.props.selectedMovie));
    }

    //*******************************************************************

    render() {
        /*const ActorInfo = ({actors}) => {

            if(!actors){

                var stateactorsList = this.state.reviewsList;
                return stateactorsList.map((actor, i) =>
                    <p key={i}>
                        <b>{actor.actorName}</b> {actor.characterName}
                    </p>
                )


            }
            else{
                var actorsList = JSON.parse(JSON.stringify(actors));
                this.setState(actorsList);
                return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            )

            }


        }

        const ReviewInfo = ({reviews}) => {

            if(!reviews){
                var statereviewsList = this.state.reviewsList;

                return statereviewsList.map((review, i) =>
                    <p key={i}>
                        <b>{review.username}</b> {review.quote}
                        <Glyphicon glyph={'star'} /> {review.rating}
                    </p>
                )

            }
            else{
                var reviewsList = JSON.parse(JSON.stringify(reviews));
                this.setState(reviewsList);

                return reviews.map((review, i) =>
                    <p key={i}>
                        <b>{review.username}</b> {review.quote}
                        <Glyphicon glyph={'star'} /> {review.rating}
                    </p>
                )
            }



        }*/
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


        //********************************************************************

        const DetailInfo = ({currentMovie}) => {

            if (!currentMovie) { //if not could still be fetching the movie
                return <Panel>
                    <Panel.Heading>Movie Detail</Panel.Heading>
                    <Panel.Body><Image className="image" src={this.state.currentMovie.imageUrl} thumbnail /></Panel.Body>
                    <ListGroup>
                        <ListGroupItem>{this.state.currentMovie.title}</ListGroupItem>
                        <ListGroupItem><ActorInfo actors={this.state.currentMovie.actors} /></ListGroupItem>
                        <ListGroupItem><h4><Glyphicon glyph={'star'}/> {this.state.currentMovie.avgRating} </h4></ListGroupItem>
                    </ListGroup>
                    <Panel.Body><ReviewInfo reviews={this.state.currentMovie.reviews} /></Panel.Body>

                </Panel>
            }
            else{
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

                    </Panel>
                );
            }
        }

        // return (
        //
        //     <DetailInfo currentMovie={this.props.selectedMovie} />
        //
        // )

        return (
            <div>
                <DetailInfo currentMovie={this.props.selectedMovie} />
                <Form horizontal>
                    <FormGroup controlId="quote">
                        <Col componentClass={ControlLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.quote} type="text" placeholder="small quote" />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="rating">
                        <Col componentClass={ControlLabel} sm={2}>
                            Rating
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.rating} type="number" min="1" max="5" />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.submit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>

            </div>
        );
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