import React, { Component } from 'react';

class SizeChartTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectAbles: this.props.data.values.map(value => {
        return parseInt(value.id);
      })
    };

    this.chooseASize = this.chooseASize.bind(this);
  }

  componentDidMount() {
    const $ = window.$$;
    if ($('.sizechart-slide .hide-row').length > 0) {
      $('.sizechart-slide .hide-row').each(function () {
        $(this).parent().hide();
      });
    }
  }

  chooseASize(name, value, id) {
    this.props.onHide();
    this.props.callback({ target: { name, value } }, id, name);
  }


  render() {
    const { chart, label, id, code } = this.props.data;
    const { attributes, isInStock, _this } = this.props;
    console.log("Roe w ", chart.points)
    let cols = Object.keys(chart.points);
    //cols = ['option', ...cols].splice(0, cols.length);
    delete chart.points['0'].lable;
    delete chart.points['0'].templateName;
    let rows = Object.keys(chart.points['0']);
    rows = ['templateName', ...rows];
    chart.points['0'].templateName = label;
    const sizeObj = chart.points.find(c => c.templateName === 'Size')


    return (
      <div className="sizechart-slide">
        <div className="size-table">
          <table>
            <tbody>
              {
                rows.map((key, index) => {
                  return <tr key={key} className={key == 'templateName' ? "thead" : ""}>
                    {
                      key != 'templateName'
                        ?
                        <td>
                          <div className="custom-radio-ui">
                            <label>
                              {/* (this.state.selectAbles.indexOf(parseInt(key)) < 0 || !isInStock(attributes, 'size', key, _this)) &&
                              condition in disabled
                              */}
                              <input disabled={sizeObj[key] === this.props.size}
                                onChange={(e) => this.chooseASize(code, key, id)} type="radio" className="option-input" name='chart' defaultValue={key} />
                              <span className="filter-input"></span>
                            </label>
                          </div>
                        </td>
                        :
                        <td width="50"></td>
                    }

                    {
                      cols.map((value) => {
                        const key1 = key == 'templateName' && value != '0' ? 'name' : key;
                        return <td key={value} className={chart.points[value][key1] == '0' ? 'hide-row' : ''}>{chart.points[value][key1]}</td>
                      })
                    }
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
        {
          typeof chart.image !== 'undefined' && chart.image != ''
          &&
          <div className="size-img">
            <img src={chart.image} alt="" />
          </div>
        }
      </div>
    )
  }
}

export default SizeChartTable;
