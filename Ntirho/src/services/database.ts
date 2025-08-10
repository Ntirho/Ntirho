import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Disability, Certificate, Education, Experience, Job, UserAttributes, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class Database {
  // Create a single supabase client for interacting with your database
  private url = 'https://arakkkodaczdppbpzlyo.supabase.co';
  private key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyYWtra29kYWN6ZHBwYnB6bHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDkwNTEsImV4cCI6MjA3MDMyNTA1MX0.lWP6C24QD87XjPJaW8xoM4quWuUndYLyefVQ6ED4KPY';
  public supabase: SupabaseClient;

  constructor(){
    this.supabase = createClient(this.url, this.key);
  }

  /**
   * Authentication
   */

  // Sign up with email and password. Email has to be confirmed
  async signUpWithEmailPassword(email: string, password: string/*, urlRedirect: string*/){
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password
      // options: {
      //   emailRedirectTo: urlRedirect
      // }
    });

    return { data, error };
  }

  // Resend confirmation
  async resendEmailConfirmation(email: string){
    return await this.supabase.auth.resend({
      type: 'signup',
      email: email
    });
  }

  // Checks if the user is registered
  async checkUser(email: string) {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error) {
      console.error('Error fetching users: ', error);
      return;
    }

    const emailExists = data?.some(x => x.email == email);

    return emailExists;
  }

  // Sign in with email and password
  async signInWithEmailPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    return { data, error };
  }

  // Sign in with email OTP
  async signInWithEmailOTP(email: string, urlRedirect: string) {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: urlRedirect
      }
    });

    return { data, error };
  }
  async verifyEmailOTP(email: string, token: string){
    const { data, error } = await this.supabase.auth.verifyOtp({ 
      token_hash: token, 
      type: 'email'
    });

    return { data, error };
  }

  // Update user password
  async updatePassword(password: string){
    const { data, error } = await this.supabase.auth.updateUser({
      password: password
    });

    return { data, error };
  }

  // Reset password
  async resetPassword(email: string){
    // Only sends the email with url to the page for resetting the password
    await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: 'https://mintirho.netlify.app/reset-password/'
      });
  }

  /**
   * The tables we have in the database
   * 
   * certificate
   * disabilities
   * education
   * experience
   * jobs
   * user_attributes
   * users
   */

  /**
   * Insertions
   */
  // Certificate
  async insertCertificate(certificate: Certificate) {
    const { data, error } = await this.supabase.from('certificate').insert(certificate).select();

    return { data, error };
  }

  // Disability
  async insertDisability(disability: Disability) {
    const { data, error } = await this.supabase.from('disabilities').insert(disability).select();

    return { data, error };
  }

  // Education
  async insertEducation(education: Education, user_id: number) {
    education.user_id = user_id;
    const { data, error } = await this.supabase.from('education').insert(education).select();

    return { data, error };
  }

  // Experience
  async insertExperience(experience: Experience) {
    const { data, error } = await this.supabase.from('experience').insert(experience).select();

    return { data, error };
  }

  // Job
  async insertJob(job: Job)
  {
    const { data, error } = await this.supabase.from('jobs').insert(job).select();

    return { data, error };
  }

  // User_attributes
  async insertUserAttributes(attribute: UserAttributes) {
    const { data, error } = await this.supabase.from('user_attributes').insert(attribute).select();

    return { data, error };
  }

  // User
  async insertUser(user: Omit<User, 'user_id'>) {
  const { data, error } = await this.supabase
    .from('users')
    .insert([user])
    .select();

  return { data, error };
}

async testInsert() {
  const testUser = {
    full_names: 'Test User',
    email: 'test@example.com',
    code: '+27',
    cell: '0821234567',
    sex: 'M',
    ethnicity: 'Test',
    home_language: 'English',
    location: 'Polokwane',
    driver_license: true,
    has_disability: false,
    date_of_birth: '1990-01-01',
    date_created: new Date().toISOString()
  };

  const { data, error } = await this.supabase
    .from('users')
    .insert([testUser])
    .select();

  console.log('Test Insert:', { data, error });
}


  /**
   * Selects
   */
  // Certificate
  async getCertificates() {
    return await this.supabase.from('certificate').select('*');
  }

  // Disability
  async getDisability(id: number) {
    const list = await this.supabase.from('disabilities').select('*');
    // const disability!: Disability;
    return list;
  }

  // Education
  async getEducation(id: number): Promise<Education[]> {
    const { data, error } = await this.supabase.from('education').select('*');

    if(error){
      console.error('Error while fetching the qualifications.');
      return [];
    }

    const qualifications = data?.filter(x => x.user_id === id) ?? [];

    return qualifications;
  }

  // Experience
  async getExperiences() {
    return await this.supabase.from('experience').select('*');
  }

  // Job
  async getJobs() {
    return await this.supabase.from('jobs').select('*');
  }

  // User_attributes
  async getUserAttributes(id: number) {
    return await this.supabase.from('user_attributes').select('*');
  }

  // User
  async getUser(id: number) {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error)
      console.log('Error while fetching users.', error);

    const user = data?.find(x => x.user_id == id);

    return { user, error }
  }
  async getUserByEmail(email: string): Promise<number> {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error)
      console.log('Error while fetching users.', error);

    const user = data?.find(x => x.email == email);

    return user.user_id
  }

  /**
   * Update
   */
  // Certificate
  async updateCertificate(certificate: Certificate) {
    const { data, error } = await this.supabase.from('certificate')
      .update({ credential_url: certificate.credential_url, expiry_date: certificate.expiry_date})
      .eq('certificate_id', certificate.certificate_id)
      .select();

    return { data, error };
  }

  // Users
  async updateUser(user: { user_id: number; full_names?: string; email?: string; location?: string }) {
    const { data, error } = await this.supabase.from('users')
      .update({
        full_names: user.full_names,
        email: user.email,
        location: user.location
      })
      .eq('user_id', user.user_id)
      .select();

    return { data, error };
  }

  // User Attributes
  async updateUserAttributes(attrs: { attribute_id: number; skill?: string; interest?: string }) {
    const { data, error } = await this.supabase.from('user_attributes')
      .update({
        skill: attrs.skill,
        interest: attrs.interest
      })
      .eq('attribute_id', attrs.attribute_id)
      .select();

    return { data, error };
  }

  // Disabilities
  async updateDisability(disability: { disability_id: number; type?: string; reason?: string }) {
    const { data, error } = await this.supabase.from('disabilities')
      .update({
        type: disability.type,
        reason: disability.reason
      })
      .eq('disability_id', disability.disability_id)
      .select();

    return { data, error };
  }

  // Education
  async updateEducation(education: { education_id: number; average?: number; completion_date?: string }) {
    const { data, error } = await this.supabase.from('education')
      .update({
        average: education.average,
        completion_date: education.completion_date
      })
      .eq('education_id', education.education_id)
      .select();

    return { data, error };
  }

  // Experience
  async updateExperience(exp: { experience_id: number; title?: string; description?: string; start_date?: string; end_date?: string }) {
    const { data, error } = await this.supabase.from('experience')
      .update({
        title: exp.title,
        description: exp.description,
        start_date: exp.start_date,
        end_date: exp.end_date
      })
      .eq('experience_id', exp.experience_id)
      .select();

    return { data, error };
  }


  /**
   * Delete
   */
  // Users
  async deleteUser(user_id: number) {
    const { data, error } = await this.supabase.from('users')
      .delete()
      .eq('user_id', user_id)
      .select();

    return { data, error };
  }

  // User Attributes
  async deleteUserAttribute(attribute_id: number) {
    const { data, error } = await this.supabase.from('user_attributes')
      .delete()
      .eq('attribute_id', attribute_id)
      .select();

    return { data, error };
  }

  // Disabilities
  async deleteDisability(disability_id: number) {
    const { data, error } = await this.supabase.from('disabilities')
      .delete()
      .eq('disability_id', disability_id)
      .select();

    return { data, error };
  }

  // Education
  async deleteEducation(education_id: number) {
    const { data, error } = await this.supabase.from('education')
      .delete()
      .eq('education_id', education_id)
      .select();

    return { data, error };
  }

  // Experience
  async deleteExperience(experience_id: number) {
    const { data, error } = await this.supabase.from('experience')
      .delete()
      .eq('experience_id', experience_id)
      .select();

    return { data, error };
  }

  // Certificate
  async deleteCertificate(certificate_id: number) {
    const { data, error } = await this.supabase.from('certificate')
      .delete()
      .eq('certificate_id', certificate_id)
      .select();

    return { data, error };
  }

}
