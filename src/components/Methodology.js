import React, { Component } from 'react';
import { Layout } from 'antd';

class Methodology extends Component {
  
    render() {
        const { Content } = Layout;
        return (
            <Content id="methods" style={{ background: '#fefefe', padding: '50px 0', height: '80vh' }}>
                <div className="content-section">
                    <div className="content-header">Methodology</div>
                    <br />
                    <div style={{ textAlign: 'left' }}>                    
                        Prepared by the&nbsp;
                        <a className="customLink"
                            href="http://www.iddynamics.jhsph.edu/">
                            Johns Hopkins IDD
                        </a>
                        &nbsp;Working Group.
                    </div>
                </div>
            </Content>
        )
    }
}

export default Methodology;