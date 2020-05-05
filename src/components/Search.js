import React, { Component } from 'react';
import { COUNTIES } from '../utils/constants.js';

class Search extends Component {
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
            <div className="dropdown">
                <div className="row">
                    <div className="col-9">
                        <div
                            className="btn dropdown-toggle search-bar"
                            type="button" 
                            id="dropdown-menu" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">
                            Search for your county
                        </div>
                        <div
                            className="dropdown-menu"
                            aria-labelledby="dropdown-menu">
                            {COUNTIES.map(county => {
                                return (
                                    <button
                                        className="dropdown-item filter-label"
                                        type="button" 
                                        onClick={() => this.handleClick(county)} 
                                        key={county.geoid}>
                                        {county.name}
                                    </button>
                                )
                                })}
                        </div>
                    </div>
                    <div className="col-3">
                        <form>
                            <div class="custom-file filter-label">
                                <input
                                    type="file"
                                    class="custom-file-input"
                                    placeholder="Upload File"
                                    id="upload">
                                </input>
                                <label
                                    class="custom-file-label"
                                    for="upload">
                                    Upload File
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

            </div>            
        )
    }
}

export default Search;