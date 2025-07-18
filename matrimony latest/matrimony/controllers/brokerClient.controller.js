const UserProfile = require('../models/Userprofile');
const PartnerPreference = require('../models/Partnerpreference');
const BrokerClient = require('../models/BrokerClient');

const registerBrokerClient = async (req, res) => {
  const t = await UserProfile.sequelize.transaction();

  try {
    const { broker_id, userprofile, partnerpreference, remarks } = req.body;

    const profile = await UserProfile.create(
      {
        ...userprofile,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    const client_profile_id = profile.id;

    await PartnerPreference.create(
      {
        ...partnerpreference,
        user_id: client_profile_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await BrokerClient.create(
      {
        broker_id,
        client_profile_id,
        remarks,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({ message: 'Client registered under broker successfully' });
  } catch (err) {
    await t.rollback();
    console.error("❌ Error in broker client registration:", err);
    res.status(500).json({ error: 'Failed to register client', details: err.message });
  }
};

module.exports = {
  registerBrokerClient,
};
