import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  //  user data
  username: '',
  email: '',
  role: 'user',
  password: '',
  regUserType: 'lawyer',
  profile: {
    name: '',
    activeProfile: 'basic',
    country: '',
  },
  //  company profile data
  companyInfo: {
    companyTeam: false,
    companyName: '',
    phone: '',
    website: '',
    companySize: '',
  },
  // lawyer service map
  lawyerServiceMap: {
    userProfile: '', // string (ObjectId)
    services: [], // string[] (ObjectId[])
    country: '', // string (ObjectId)
    zipCode: '', // string (ObjectId[])
    rangeInKm: '', // string (ObjectId)
    practiceWithin: false,
    practiceInternationally: false,
    isSoloPractitioner: false,
  },
};

export const registrationSlice = createSlice({
  name: 'lawyerRegistration',
  initialState,
  reducers: {
    updateField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    // Nested update: profile or lawyerServiceMap
    updateNestedField: (state, action) => {
      const { section, field, value } = action.payload;
      if (state[section]) {
        state[section][field] = value;
      }
    },

    // Bulk update (useful for prefilling forms)
    bulkUpdate: (state, action) => {
      return { ...state, ...action.payload };
    },

    // Step navigation
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },

    // Reset everything
    resetRegistration: () => initialState,

    //  add new logic
    addOrRemoveServiceId: (state, action) => {
      const id = action.payload;
      const index = state.lawyerServiceMap.services.indexOf(id);
      if (index > -1) {
        state.lawyerServiceMap.services.splice(index, 1);
      } else {
        state.lawyerServiceMap.services.push(id);
      }
    },
    setSelectedServiceIds: (state, action) => {
      state.lawyerServiceMap.services = action.payload;
    },
  },
});

export const {
  updateField,
  updateNestedField,
  bulkUpdate,
  nextStep,
  prevStep,
  resetRegistration,
  addOrRemoveServiceId,
  setSelectedServiceIds,
  addOrRemoveZipCode,
  setSelectedZipCodes, // ✅ newly added action
} = registrationSlice.actions;
export default registrationSlice.reducer;
