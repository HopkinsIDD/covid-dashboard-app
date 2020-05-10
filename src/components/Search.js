import React, { Component } from 'react';
// import axios from 'axios';
import { COUNTIES } from '../utils/constants.js';
import { ReactComponent as MagnifyingGlass } from '../assets/search.svg';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            countyName: '',
        }
    }

    handleCountySelect = (event) => {
        const dataset = require(`../store/geo${event.geoid}.json`);
        this.props.onCountySelect(dataset);
        // console.log('event.name', event.name)
        // console.log('dataset', dataset)
        this.setState({
            'countyName': event.name + ', ' + event.usps
        })

        // use for when files are on public internet
        // axios.get(event.path)
        //     .catch(error => {
        //         console.log('error', error);
        //     })
        //     .then(response => {
        //         // console.log('event', event)
        //         // console.log('response', response)
        //         const json = response.data;
        //         this.props.onCountySelect(json);
        //         this.setState({
        //             'countyName': event.name + ', ' + event.usps
        //         })
        //     });
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
        const { fileName, countyName } = this.state;
        const countyLabel = countyName === '' ? 'Search for your county' : countyName;
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
                            <MagnifyingGlass />
                            {countyLabel}
                        </div>
                        <div
                            className="dropdown-menu"
                            aria-labelledby="dropdown-menu">
                            {COUNTIES.map(county => {
                                const isActive = this.props.geoid === county.geoid ? ' btn-active' : '';
                                return (
                                    <button
                                        className={"dropdown-item filter-label" + isActive}
                                        type="button" 
                                        onClick={() => this.handleCountySelect(county)} 
                                        key={county.geoid}>
                                        {county.name}, {county.usps}
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