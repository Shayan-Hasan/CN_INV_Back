const db = require('../connection/connection');

const addUnit = (req, res) => {
    const { name } = req.body;
    const sql = 'call inv.sp_add_unit(?);';
    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error('Database insertion error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      console.log('Unit inserted successfully');
      return res.json({ message: 'Unit inserted successfully' });
    });
};

const GetAllUnits = (req, res) => {
  const sql = 'SELECT * FROM inv.units';
  db.query(sql, (err, result) => {
    return res.json(result);
  });
};

const DeleteUnitById = (req, res) => {

  const { unit_id } = req.body;
  // console.log("delete")
  // console.log(unit_id)
  const sql = 'call inv.sp_delete_unit(?);'
  db.query(sql,[unit_id], (err, result) => {
      if (err) {
          console.error('Database insertion error:', err);
          return res.status(500).json({ error: 'Failed to Remove Unit' });
        }
        console.log('Unit Removed successfully');
        return res.status(200).json({ message: 'Unit Removed successfully' });
      });  
};

  module.exports = {
    addUnit,
    GetAllUnits,
    DeleteUnitById,
  };