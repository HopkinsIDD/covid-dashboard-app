import React, { Fragment } from 'react';
import { addCommas } from '../../utils/utils.js';
import { timeFormat } from 'd3-time-format';

const getReadableDate = timeFormat('%b %d, %Y');

function SummaryLabel(props) {
    console.log(props)
    const startDate = getReadableDate(props.summaryStart);
    const endDate = getReadableDate(props.summaryEnd);

    return (
        <Fragment>
          <p className={props.classProps}>
              <span className="bold">50%</span>
              &nbsp;{`chance of `}<span className="bold">{addCommas(Math.ceil(props.median))}</span>
              &nbsp;{`${props.label}`}
              {/* from `}<span className="bold">{startDate}</span>
              &nbsp;{`to `}<span className="bold">{endDate}</span> */}
          </p>
          <p className={props.classProps}>
            <span className="bold">90%</span>
              &nbsp;{`chance of `}<span className="bold">{addCommas(Math.ceil(props.tenth))}</span>
              &nbsp;{`to `}<span className="bold">{addCommas(Math.ceil(props.ninetyith))}</span>
              &nbsp;{`${props.label}`} 
              {/* from `}<span className="bold">{startDate}</span>
              &nbsp;{`to `}<span className="bold">{endDate}</span> */}
          </p>
        </Fragment>
        )
}

export default SummaryLabel