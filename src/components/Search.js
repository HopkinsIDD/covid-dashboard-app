import React, { Component } from 'react';
import { COUNTIES } from '../utils/constants.js';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
        }
    }

    handleSearchClick = (event) => {
        console.log('event', event)
    }

    handleUpload = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            if (this.validateSize(file) && this.validateType(file)) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const json = JSON.parse(fileReader.result);
                    this.props.onFileUpload(json);
                    this.setState({'fileName': file.name})
                }
                fileReader.readAsText(file)
            }
        }
    }

    validateSize = (file) => {
        let size = 100000000;  //100mb
        let error = '';
        if (file.size > size) {
            error = 'File is too large, please upload a smaller file';
            // react-toastify beautifies notifications
            alert(error);
        } else {
            return true;
        }
    }

    validateType = (file) => {
        let error = '';
        if (file.type !== 'application/json') {
            error = 'Please upload json file';
            // react-toastify beautifies notifications
            alert(error);
        } else {
            return true;
        }
    }

    render() {
        const { fileName } = this.state;
        const uploadLabel = fileName === '' ? 'Upload File' : fileName;
        
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
                                        onClick={() => this.handleSearchClick(county)} 
                                        key={county.geoid}>
                                        {county.name}
                                    </button>
                                )
                                })}
                        </div>
                    </div>
                    <div className="col-3">
                        <form>
                            <div className="custom-file filter-label">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    placeholder="Upload File"
                                    id="upload"
                                    onChange={this.handleUpload}>
                                </input>
                                <label
                                    className="custom-file-label"
                                    htmlFor="upload">
                                    {uploadLabel}
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