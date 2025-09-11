import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Disability, Certificate, Education, Experience, Job, UserAttributes, User, AppUser } from '../interfaces';
import { UUID } from 'crypto';
import { abort } from 'process';
import { environment } from '../environments/environment.development';
import { Subject } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class Database {
  // Create a single supabase client for interacting with your database
  private url = environment.SUPABASE_URL;
  private key = environment.SUPABASE_KEY;
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

    // Sign up with email and password. Email has to be confirmed
  async signUpWithEmailPasswordMetadata(email: string, password: string, user: AppUser){
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_names: user.full_names,
          date_of_birth: user.date_of_birth,
          cell: user.cell,
          code: user.code,
          location: user.location,
          has_disability: user.has_disability,
          driver_license: user.driver_license,
          ethnicity: user.ethnicity,
          home_language: user.home_language,
          sex: user.sex
        }
      }
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
    const { data, error } = await this.supabase.from('disability').insert(disability).select();

    return { data, error };
  }

  // Education
  async insertEducation(education: Education) {
    //education.user_id = user_id;
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

  // Subject
  async insertSubject(subject: Omit<Subject, 'subject_id'>) {
    const { data, error } = await this.supabase
      .from('subject')
      .insert(subject)
      .select()
      .single();

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
  async getCertificates(id: string): Promise<Certificate[]> {
    const { data, error } = await this.supabase.from('certificate').select('*');

    if (error){
      console.error('Error in retrieving certificates.', error);
      return [];
    }

    const certificates = data?.filter(x => x.user_id === id) ?? [];

    return certificates;
  }

  // Disability
  async getDisability(user_id: string) {
    const list = await this.supabase.from('disability').select('*');
    // const disability!: Disability;
    return list;
  }

  // Education
  async getEducation(id: string): Promise<Education[]> {
    const { data, error } = await this.supabase.from('education').select('*');

    if(error){
      console.error('Error while fetching the qualifications.');
      return [];
    }

    const qualifications = data?.filter(x => x.user_id === id) ?? [];

    return qualifications;
  }

  // Experience
  async getExperiences(id: string): Promise<Experience[]> {
    const { data, error } =  await this.supabase.from('experience').select('*');

    if (error) {
      console.error('Error while retrieving experiences.', error);
      return [];
    }

    console.log('Experiences.', data);

    const experiences = data?.filter(x => x.user_id === id) ?? [];
    console.log('Experiences filtered.', experiences);

    return experiences;
  }

  // Subject
  async getSubjects(id: number): Promise<Subject[]> {
    const { data, error } =  await this.supabase.from('subject')
                                                .select('*')
                                                .eq('qualification_id', id);

    if (error) {
      console.error('Error while retrieving subjects.', error);
      return [];
    }

    return data;
  }

  // Job
  async getJobs() {
    return await this.supabase.from('jobs').select('*');
  }

  // User_attributes
  async getUserAttributes(id: string) {
    return await this.supabase.from('user_attributes')
                              .select('*')
                              .eq("user_id", id)
                              .single();
  }

  // User
  async getUser(id: string) {
    const { data, error } = await this.supabase.from('app_user')
                                  .select('*')
                                  .eq("id", id)
                                  .single();

    if (error)
      console.log('Error while fetching users.', error);

    return { data, error }
  }
  async getUserByEmail(email: string): Promise<string> {
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
  async updateCertificate(certificate: Certificate, id: number) {
    const { data, error } = await this.supabase.from('certificate')
      .update({ 
        credential_url: certificate.credential_url, 
        issue_date: certificate.issue_date,
        expiry_date: certificate.expiry_date
      })
      .eq('certificate_id', id)
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
  async updateUserAttributes(attrs: UserAttributes) {
    const { data, error } = await this.supabase.from('user_attributes')
      .update({
        skills: attrs.skills,
        interests: attrs.interests,
        about: attrs.about
      })
      .eq('user_id', attrs.user_id)
      .select();

    return { data, error };
  }

  // Disabilities
  async updateDisability(disability: { user_id: UUID; type?: string; reason?: string }) {
    const { data, error } = await this.supabase.from('disability')
      .update({
        //type: disability.type,
        disability: disability.reason
      })
      .eq('user_id', disability.user_id)
      .select();

    return { data, error };
  }

  // Education
  async updateEducation(education: Education, id: number) {
    const { data, error } = await this.supabase.from('education')
      .update({
        qualification: education.qualification,
        average: education.average,
        name: education.name,
        completion_date: education.completion_date
      })
      .eq('qualification_id', id)
      .select();

    return { data, error };
  }

  // Experience
  async updateExperience(exp: Experience, id: number) {
    const { data, error } = await this.supabase.from('experience')
      .update({
        description: exp.description,
        end_date: exp.end_date
      })
      .eq('experience_id', id)
      .select();

    return { data, error };
  }

  // Subject
  async updateSubject(subj: Subject, id: number) {
    const { data, error } = await this.supabase.from('subject')
      .update({
        name: subj.name,
        average: subj.average
      })
      .eq('subject_id', id)
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
  async deleteDisability(user_id: string) {
    const { data, error } = await this.supabase.from('disability')
      .delete()
      .eq('user_id', user_id)
      .select();

    return { data, error };
  }

  // Education
  async deleteEducation(education_id: number) {
    const { data, error } = await this.supabase.from('education')
      .delete()
      .eq('qualification_id', education_id)
      .select();

    if(error)
      console.error('Error while updating education', error);

    return { data, error };
  }

  // Experience
  async deleteExperience(experience_id: number) {
    const { data, error } = await this.supabase.from('experience')
      .delete()
      .eq('experience_id', experience_id)
      .select();

    if(error)
      console.error('Error while updating experience', error);

    return { data, error };
  }

  // Subject
  async deleteSubject(subject_id: number) {
    const { data, error } = await this.supabase.from('subject')
      .delete()
      .eq('subject_id', subject_id)
      .select();

    if(error)
      console.error('Error while updating subject', error);

    return { data, error };
  }

  // Certificate
  async deleteCertificate(certificate_id: number) {
    const { data, error } = await this.supabase.from('certificate')
      .delete()
      .eq('certificate_id', certificate_id)
      .select();

    if(error)
      console.error('Error while updating certificate', error);

    return { data, error };
  }

}
