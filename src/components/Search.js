import React, { Component } from 'react';
import { COUNTIES } from '../store/constants.js';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
// import axios from 'axios'

// TODO: currently using refs for query binding, but may change to this.state.value
// https://reactjs.org/docs/refs-and-the-dom.html
// need to save submitted input to state
// Bootstrap filtered table: https://www.w3schools.com/Bootstrap/bootstrap_filters.asp
const Suggestions = (props) => {
    const options = props.counties.map(r => (
        <li key={r.GEOID}>{r.NAME}, {r.USPS}</li>
    ))
    return <ul className="suggest-dropdown">{options}</ul>
}

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            counties: [],
            geoid: "",
        };
    }

    getCountyNames = (props) => {
        let filtered = [];
        const input = props.toUpperCase()
        for (let i = 0; i < COUNTIES.length; i++) {
            if (COUNTIES[i].NAME.toUpperCase().indexOf(input) > -1) {
                filtered.push(COUNTIES[i])
            }
        }
        
        this.setState({
            counties: filtered,
        })
        // axios.get().then(({ data }) => {
        //     this.setState({
        //         county: data.data
        //     })
        // })
    }

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        }, () => {
            if (this.state.query && this.state.query.length > 1) {
                this.getCountyNames(this.search.value)
            }
        })
        console.log(this.state.query)
    }

    render() {
        return (
            <div>
                <InputGroup className="mb-3 search-bar">
                    <InputGroup.Prepend>
                        <InputGroup.Text
                            id="inputGroup-sizing-default">
                            Daily New Infections in
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Default"
                        placeholder="Search for your county"
                        ref={input => this.search = input}
                        onChange={this.handleInputChange}
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>
                <Suggestions counties={this.state.counties} />
            </div>
        )
    }
}

export default Search;