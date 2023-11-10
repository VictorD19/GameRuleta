export default function SalasCard() {
  return (
      <div className="row my-3">
        <div className="col-sm-12 col-md-4">
          <div className="card bg-info">
            <div className="inner p-3 card-body ">
              <h3>150</h3>

              <p>Sala 1</p>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-4 mt-4 mt-md-0">
          <div className="card bg-success">
            <div className="inner p-3 card-body ">
              <h3>53</h3>

              <p>Sala 2</p>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-4 mt-4 mt-md-0">
          <div className="card bg-warning">
            <div className="inner p-3  card-body">
              <h3>44</h3>
              <p>Sala 2</p>
            </div>
          </div>
        </div>
      </div>
  );
}
