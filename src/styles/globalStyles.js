import { StyleSheet, Platform } from 'react-native';

export const globalStyles = StyleSheet.create({
  mainContainer: {
  flex: 1,
  backgroundColor: '#FFF',
  ...Platform.select({
    web: {
      height: '100vh',
      overflowY: 'auto',
      position: 'fixed',
      width: '100%',}
  })
},
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'web' ? 200 : 100,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1, 
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnFinalizar: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  subtitle: { fontSize: 14, 
    color: '#e50e0e', 
    fontWeight: 'bold',
    marginBottom: 25, 
    textAlign: 'center' },
  footerFixed: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  carouselFixed: {
    height: 100,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});