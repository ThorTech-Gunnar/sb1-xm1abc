// ... (keep existing imports and interfaces)

class LocalDatabase {
  // ... (keep existing methods)

  async checkTrialStatus(userId: string) {
    const user = await this.findOne('users', { _id: userId });
    if (user) {
      const now = new Date();
      user.isTrialExpired = now > new Date(user.trialEndDate);
      await this.update('users', { _id: userId }, { isTrialExpired: user.isTrialExpired });
      return user.isTrialExpired;
    }
    return true; // Assume trial expired if user not found
  }
}

export const localDb = new LocalDatabase();