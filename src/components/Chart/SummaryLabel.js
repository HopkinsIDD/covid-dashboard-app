import React, { Fragment } from 'react';
import { addCommas } from '../../utils/utils.js';

function SummaryLabel(props) {
    return (
        <Fragment>
          <div className={props.classProps}>
              <span className="bold">{props.scenario}</span>&nbsp;scenario:&nbsp;
              <span className="bold">50%</span>
              &nbsp;{`chance of `}<span className="bold">{addCommas(Math.ceil(props.median))}</span>
              &nbsp;{`${props.label}`}
              {/* from `}<span className="bold">{startDate}</span>
              &nbsp;{`to `}<span className="bold">{endDate}</span> */}
          </div>
          <div className={props.classProps}>
            <span className="bold">90%</span>
              &nbsp;{`chance of `}<span className="bold">{addCommas(Math.ceil(props.tenth))}</span>
              &nbsp;{`to `}<span className="bold">{addCommas(Math.ceil(props.ninetyith))}</span>
              &nbsp;{`${props.label}`} 
              {/* from `}<span className="bold">{startDate}</span>
              &nbsp;{`to `}<span className="bold">{endDate}</span> */}
          </div>
        </Fragment>
        )
}

export default SummaryLabel