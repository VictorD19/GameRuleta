export default function SalasCard(){
    return  <section className="content my-3  d-flex justify-conten-center">
    <div className="container-fluid">
      <div className="row justify-content-md-center">
        <div className="col-lg-3 col-6 ">
          <div className="small-box bg-info">
            <div className="inner p-2">
              <h3>150</h3>

              <p>Sala 1</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner p-2">
              <h3>
                53
              </h3>

              <p>Sala 2</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-warning">
            <div className="inner p-2">
              <h3>44</h3>
              <p>Sala 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
}