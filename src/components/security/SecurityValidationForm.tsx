import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { securityService, clientValidationSchemas } from '@/services/securityService'
import { useToast } from '@/hooks/use-toast'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  data?: any
}

export const SecurityValidationForm: React.FC = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    fonction: '',
    department: '',
    salary: '',
    start_date: '',
  })

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    project_manager: '',
  })

  const [password, setPassword] = useState('')
  
  const [validationResults, setValidationResults] = useState<{
    employee?: ValidationResult
    project?: ValidationResult
    password?: ValidationResult
  }>({})

  const { toast } = useToast()

  const validateEmployee = () => {
    try {
      const processedData = {
        ...employeeData,
        salary: employeeData.salary ? parseFloat(employeeData.salary) : undefined,
      }
      
      const validatedData = securityService.validateData('employee', processedData)
      
      setValidationResults(prev => ({
        ...prev,
        employee: { isValid: true, errors: [], data: validatedData }
      }))

      toast({
        title: "Validation réussie",
        description: "Les données employé sont valides"
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de validation'
      setValidationResults(prev => ({
        ...prev,
        employee: { isValid: false, errors: [errorMessage] }
      }))

      toast({
        title: "Validation échouée",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const validateProject = () => {
    try {
      const processedData = {
        ...projectData,
        budget: projectData.budget ? parseFloat(projectData.budget) : 0,
        team: [],
        consultants: [],
      }
      
      const validatedData = securityService.validateData('project', processedData)
      
      setValidationResults(prev => ({
        ...prev,
        project: { isValid: true, errors: [], data: validatedData }
      }))

      toast({
        title: "Validation réussie",
        description: "Les données projet sont valides"
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de validation'
      setValidationResults(prev => ({
        ...prev,
        project: { isValid: false, errors: [errorMessage] }
      }))

      toast({
        title: "Validation échouée",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const validatePasswordStrength = () => {
    const result = securityService.validatePasswordStrength(password)
    
    setValidationResults(prev => ({
      ...prev,
      password: { isValid: result.isValid, errors: result.errors }
    }))

    if (result.isValid) {
      toast({
        title: "Mot de passe fort",
        description: "Le mot de passe respecte tous les critères"
      })
    } else {
      toast({
        title: "Mot de passe faible",
        description: "Le mot de passe ne respecte pas tous les critères",
        variant: "destructive"
      })
    }
  }

  const renderValidationStatus = (result?: ValidationResult) => {
    if (!result) return null

    return (
      <div className="mt-4">
        {result.isValid ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Validation réussie
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {result.errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Tests de Validation Sécurisée</h2>
      </div>

      <Tabs defaultValue="employee" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employee">Employé</TabsTrigger>
          <TabsTrigger value="project">Projet</TabsTrigger>
          <TabsTrigger value="password">Mot de Passe</TabsTrigger>
        </TabsList>

        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <CardTitle>Validation des Données Employé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emp-name">Nom *</Label>
                  <Input
                    id="emp-name"
                    value={employeeData.name}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Jean Dupont"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emp-email">Email *</Label>
                  <Input
                    id="emp-email"
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="emp-fonction">Fonction *</Label>
                  <Input
                    id="emp-fonction"
                    value={employeeData.fonction}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, fonction: e.target.value }))}
                    placeholder="Développeur"
                  />
                </div>

                <div>
                  <Label htmlFor="emp-department">Département *</Label>
                  <Input
                    id="emp-department"
                    value={employeeData.department}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="IT"
                  />
                </div>

                <div>
                  <Label htmlFor="emp-salary">Salaire</Label>
                  <Input
                    id="emp-salary"
                    type="number"
                    value={employeeData.salary}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="emp-start">Date de début *</Label>
                  <Input
                    id="emp-start"
                    type="date"
                    value={employeeData.start_date}
                    onChange={(e) => setEmployeeData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={validateEmployee} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Valider les Données Employé
              </Button>

              {renderValidationStatus(validationResults.employee)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project">
          <Card>
            <CardHeader>
              <CardTitle>Validation des Données Projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proj-name">Nom du Projet *</Label>
                  <Input
                    id="proj-name"
                    value={projectData.name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Refonte Application"
                  />
                </div>

                <div>
                  <Label htmlFor="proj-manager">Chef de Projet *</Label>
                  <Input
                    id="proj-manager"
                    value={projectData.project_manager}
                    onChange={(e) => setProjectData(prev => ({ ...prev, project_manager: e.target.value }))}
                    placeholder="Marie Martin"
                  />
                </div>

                <div>
                  <Label htmlFor="proj-budget">Budget *</Label>
                  <Input
                    id="proj-budget"
                    type="number"
                    value={projectData.budget}
                    onChange={(e) => setProjectData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="100000"
                  />
                </div>

                <div>
                  <Label htmlFor="proj-start">Date de début *</Label>
                  <Input
                    id="proj-start"
                    type="date"
                    value={projectData.start_date}
                    onChange={(e) => setProjectData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="proj-end">Date de fin *</Label>
                  <Input
                    id="proj-end"
                    type="date"
                    value={projectData.end_date}
                    onChange={(e) => setProjectData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="proj-desc">Description</Label>
                  <Input
                    id="proj-desc"
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description du projet..."
                  />
                </div>
              </div>

              <Button onClick={validateProject} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Valider les Données Projet
              </Button>

              {renderValidationStatus(validationResults.project)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Validation de la Force du Mot de Passe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Mot de Passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez un mot de passe..."
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Critères requis :</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {password.length >= 8 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Au moins 8 caractères</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/[A-Z]/.test(password) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Au moins une majuscule</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/[a-z]/.test(password) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Au moins une minuscule</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/\d/.test(password) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Au moins un chiffre</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Au moins un caractère spécial</span>
                  </div>
                </div>
              </div>

              <Button onClick={validatePasswordStrength} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Valider la Force du Mot de Passe
              </Button>

              {renderValidationStatus(validationResults.password)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}