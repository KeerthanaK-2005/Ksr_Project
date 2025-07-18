const dummyProfiles = [
  { matrimonyId: 'M0000001', name: 'Priya Sharma', age: 27, location: 'Chennai', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { matrimonyId: 'M0000002', name: 'Rahul Verma', age: 29, location: 'Bangalore', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { matrimonyId: 'M0000003', name: 'Anjali Singh', age: 26, location: 'Hyderabad', photo: 'https://randomuser.me/api/portraits/women/67.jpg' },
  { matrimonyId: 'M0000004', name: 'Vikram Patel', age: 30, location: 'Mumbai', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
  // ...add more as needed
];

const getProfileByMatrimonyId = async (matrimonyId) => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  const profile = dummyProfiles.find(p => p.matrimonyId === matrimonyId);
  if (!profile) throw new Error('Profile not found');
  return profile;
};

export default { getProfileByMatrimonyId }; 