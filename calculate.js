export default function handler(req, res) {
  if (req.method === 'POST') {
    const {
      P_in,
      F,
      P1,
      T1,
      OF,
      D,
      k,
      a,
      n,
      ID,
      t,
      din,
      Cd,
      M,
      D_ox,
    } = req.body;

    const Ve = Math.sqrt(
      (2 * T1 * (8314 / M) * (k / (k - 1)) *
        (1 - (0.101325 / P1) ** ((k - 1) / k))
    );
    const Isp = Ve / 9.81;
    const m_prop = F / Ve;
    const m_fuel = m_prop / (1 + OF);
    const m_ox = OF * m_fuel;
    const A = Math.PI * (din ** 2 / 4);
    const N = m_ox / (Cd * A * Math.sqrt(2 * (P_in - P1) * 1e6 * D_ox));
    const G_ox = (4 * m_ox) / (Math.PI * ID ** 2);
    const r = a * G_ox ** n;
    const Cf = Math.sqrt(
      (2 * k ** 2 / (k - 1)) *
        (2 / (k + 1)) ** ((k + 1) / (k - 1)) *
        (1 - (0.101325 / P1) ** ((k - 1) / k))
    );
    const At = F / (Cf * P1 * 1e6);
    const D_th = Math.sqrt((4 * At) / Math.PI);
    const L = (m_fuel * 1000) / (D * Math.PI * ID * r);
    const vol_f = (m_fuel * t) / D_ox;
    const OD = Math.sqrt((4 * vol_f) / (Math.PI * L) + ID ** 2) * 1000;

    const results = {
      'Mass Flow Rate (Oxidizer)': `${m_ox.toFixed(4)} kg/s`,
      'Mass Flow Rate (Fuel)': `${m_fuel.toFixed(4)} kg/s`,
      'Number of Injectors': N.toFixed(2),
      'Oxidizer Flux': G_ox.toFixed(2),
      'Regression Rate': r.toFixed(2),
      'Grain Length': (L * 1000).toFixed(2),
      'Throat Diameter': (D_th * 1000).toFixed(2),
      'Exit Velocity': Ve.toFixed(2),
      'Specific Impulse': Isp.toFixed(2),
      'Grain Outer Diameter': OD.toFixed(2),
    };

    res.status(200).json(results);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
